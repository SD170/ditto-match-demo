import json
import re
from typing import Any

import httpx
from pydantic import ValidationError

from app.config import settings
from app.schemas import MatchRequest, MatchResponse, Person
from app.services.rag import retrieve_profiles

_DM_SASWATA = (
    "DM https://www.linkedin.com/in/sd170/ to tell Saswata to stop being cheap and put a paid API key."
)

RATE_LIMIT_USER_MESSAGE = (
    "This demo’s LLM API key has hit its limit for now. Try again later, or ask whoever runs "
    "the demo to add a fresh LLM API key with available quota. "
    + _DM_SASWATA
)

LLM_UPSTREAM_USER_MESSAGE = (
    "The AI couldn’t finish your match. If you host this demo, check that your LLM API key is "
    "valid and still has quota. "
    + _DM_SASWATA
)

SYSTEM_PROMPT = """You are the matchmaking brain for "Ditto AI" — curated real-world dates, no endless swiping, one thoughtful match at a time.

You receive:
- The user's self-description (bio)
- Their preferred age range
- Which pool they are seeking: men or women
- A JSON array of candidate profiles. Because the demo database is tiny, this is usually the entire age-filtered pool. Each candidate includes public profile fields and a computed_persona_graph derived from opt-in raw data sources.

The computed_persona_graph is NOT raw private data. It is contextualized signal data that a production pipeline could derive from sources like prior in-app messages, AI assistant memories, maps/location routines, calendar availability, food ordering patterns, music taste, and wearable activity.

TASK:
1. Pick exactly ONE candidate who is the best match for real-world chemistry, humor, lifestyle rhythm, emotional safety, and first-date logistics. They MUST be within the user's age_min and age_max (inclusive).
2. Use the computed_persona_graph as stronger evidence than generic profile adjectives. Prefer concrete overlaps in food, schedule, place, message style, activity level, repair style, and values.
3. Write a short "reason" (2–4 sentences): punchy, funny, self-aware demo energy — explain why they'd click using specifics from BOTH the user's bio and the candidate's computed signals. No cringe, no slurs, keep it PG-13.
4. Propose ONE concrete in-person date plan ("date_plan") — specific activity, ~1–2 sentences, quirky but doable near a college campus.
5. Name a specific fictional-but-plausible venue ("location").
6. Suggest a time ("suggested_time") — prefer "Next Wednesday 7:00 PM" or similar evening campus vibe.

OUTPUT: Return ONLY valid JSON (no markdown fences) with this exact shape:
{
  "match": { "name": "...", "age": <int>, "bio": "...", "image": "..." },
  "reason": "...",
  "date_plan": "...",
  "location": "...",
  "suggested_time": "..."
}

Rules:
- The "match" object MUST copy name, age, bio, image EXACTLY from the chosen candidate in the pool (verbatim strings, same age int). Do not include computed_persona_graph in the match object.
- Do not invent people. Never output someone not in the list.
- Do not say you predicted compatibility. Say the agents reasoned over opt-in context.
"""


class LlmRateLimitedError(Exception):
    """Inference provider hit rate / quota limits (typical on free tiers)."""


def _llm_response_is_rate_limited(response: httpx.Response) -> bool:
    if response.status_code in (402, 429):
        return True
    if response.status_code < 400:
        return False
    try:
        blob = response.text[:1200].lower()
    except Exception:
        return False
    markers = (
        "rate_limit",
        "rate limit",
        "too many requests",
        "tokens per day",
        "requests per day",
        "quota exceeded",
        "resource exhausted",
        "throttl",
        "capacity limit",
    )
    return any(m in blob for m in markers)


def _filter_pool(pool: tuple[Person, ...], req: MatchRequest) -> list[Person]:
    return [p for p in pool if req.age_min <= p.age <= req.age_max]


def _fallback_match(pool: list[Person], req: MatchRequest) -> MatchResponse:
    pick = pool[0] if pool else None
    if pick is None:
        raise ValueError("No candidates in age range; widen age_min/age_max.")
    return MatchResponse(
        match=pick,
        reason=(
            f"{pick.name} is your Wednesday plot twist: their bio energy lines up with yours like "
            f"a well-timed punchline — same chaos, different font. Ditto's agent council would approve."
        ),
        date_plan=(
            "Grab two weird seasonal drinks, race to find the best people-watching seat, "
            "and trade 'red flag / green flag' stories using only campus lore."
        ),
        location="The Glasshouse Café — sunny corner, questionable indie playlist, excellent croissants",
        suggested_time="Next Wednesday 7:00 PM (Ditto drop o'clock)",
    )


def _extract_json_object(text: str) -> dict[str, Any]:
    text = text.strip()
    fence = re.match(r"^```(?:json)?\s*([\s\S]*?)\s*```$", text)
    if fence:
        text = fence.group(1).strip()
    return json.loads(text)


def _chat_llm() -> tuple[str, str, str] | None:
    """Returns (api_key, base_url, model). OpenRouter first for cheap demo calls."""
    if settings.openrouter_api_key:
        return (
            settings.openrouter_api_key,
            settings.openrouter_base_url,
            settings.openrouter_model,
        )
    if settings.openai_api_key:
        return (
            settings.openai_api_key,
            settings.openai_base_url,
            settings.openai_model,
        )
    return None


async def find_match(req: MatchRequest) -> MatchResponse:
    from app.data import load_pool

    pool_all = load_pool(req.seeking)
    pool = _filter_pool(pool_all, req)
    if not pool:
        pool = list(pool_all)

    pool_for_llm = retrieve_profiles(
        req.user_bio, pool, top_k=settings.rag_top_k
    )
    candidates_payload = [
        {
            "name": p.name,
            "age": p.age,
            "bio": p.bio,
            "image": p.image,
            "computed_persona_graph": p.persona_graph,
        }
        for p in pool_for_llm
    ]

    llm = _chat_llm()
    if not llm:
        return _fallback_match(pool_for_llm, req)

    api_key, base_url, model = llm

    if settings.simulate_llm_rate_limit:
        raise LlmRateLimitedError(RATE_LIMIT_USER_MESSAGE)

    user_content = json.dumps(
        {
            "user_bio": req.user_bio,
            "age_min": req.age_min,
            "age_max": req.age_max,
            "seeking": req.seeking,
            "candidates": candidates_payload,
        },
        ensure_ascii=False,
    )

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            r = await client.post(
                f"{base_url.rstrip('/')}/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "temperature": 0.85,
                    "response_format": {"type": "json_object"},
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_content},
                    ],
                },
            )
            r.raise_for_status()
        except httpx.HTTPStatusError as e:
            if _llm_response_is_rate_limited(e.response):
                raise LlmRateLimitedError(RATE_LIMIT_USER_MESSAGE) from e
            raise
        data = r.json()
        raw = data["choices"][0]["message"]["content"]

    try:
        parsed = _extract_json_object(raw)
        out = MatchResponse.model_validate(parsed)
    except (json.JSONDecodeError, ValidationError, KeyError, TypeError):
        return _fallback_match(pool_for_llm, req)

    allowed = {(_canon_name(p.name), p.age): p for p in pool_for_llm}
    key = (_canon_name(out.match.name), out.match.age)
    if key not in allowed:
        return _fallback_match(pool_for_llm, req)

    canonical = allowed[key]
    return MatchResponse(
        match=canonical,
        reason=out.reason,
        date_plan=out.date_plan,
        location=out.location,
        suggested_time=out.suggested_time,
    )


def _canon_name(s: str) -> str:
    return " ".join(s.split()).casefold()
