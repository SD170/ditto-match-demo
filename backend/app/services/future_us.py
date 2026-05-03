from __future__ import annotations

import json
import re
from typing import Any

import httpx
from pydantic import ValidationError

from app.config import settings
from app.schemas import (
    BestDatePlan,
    ChemistryDimension,
    ConnectedSignal,
    ContextConfidence,
    FutureUsRequest,
    FutureUsResponse,
    FutureUsScenario,
)

SYSTEM_PROMPT = """You are Future Us, Ditto's agentic chemistry simulation engine.

You are NOT predicting a relationship. You simulate possible early dynamics using opt-in context and relationship-science-informed dimensions. Use concrete evidence from the provided computed persona graphs: AI memory summaries, conversational LLM notes, location routines, calendar availability, food-ordering context, music context, wearable/activity signals, and in-app message style.

Output ONLY valid JSON with this exact shape:
{
  "title": "Future Us",
  "subtitle": "Private agents simulated possible dynamics — not a prediction.",
  "match_name": "...",
  "couple_thesis": "catchy 3-7 word archetype",
  "confidence": {"score": 0-100, "label": "High context confidence", "explanation": "..."},
  "connected_signals": [
    {"source": "AI Memory", "status": "...", "insight": "...", "confidence": 0-100},
    {"source": "Location Context", "status": "...", "insight": "...", "confidence": 0-100},
    {"source": "Food Ordering", "status": "...", "insight": "...", "confidence": 0-100},
    {"source": "Music Context", "status": "...", "insight": "...", "confidence": 0-100},
    {"source": "Calendar", "status": "...", "insight": "...", "confidence": 0-100}
  ],
  "chemistry_map": [
    {"name": "Rhythm Fit", "score": 0-100, "signal": "...", "opportunity": "..."},
    {"name": "Emotional Safety", "score": 0-100, "signal": "...", "opportunity": "..."},
    {"name": "Novelty + Growth", "score": 0-100, "signal": "...", "opportunity": "..."},
    {"name": "Conflict Repair", "score": 0-100, "signal": "...", "opportunity": "..."},
    {"name": "Intention Alignment", "score": 0-100, "signal": "...", "opportunity": "..."},
    {"name": "Practical Logistics", "score": 0-100, "signal": "...", "opportunity": "..."}
  ],
  "scenarios": [
    {"title": "Natural Overlap", "timeframe": "...", "prompt": "...", "simulation": "...", "best_move": "...", "watchout": "..."},
    {"title": "First Misread", "timeframe": "...", "prompt": "...", "simulation": "...", "best_move": "...", "watchout": "..."},
    {"title": "Repair Moment", "timeframe": "...", "prompt": "...", "simulation": "...", "best_move": "...", "watchout": "..."},
    {"title": "Growth Arc", "timeframe": "...", "prompt": "...", "simulation": "...", "best_move": "...", "watchout": "..."}
  ],
  "best_date": {
    "title": "...",
    "location": "...",
    "suggested_time": "...",
    "plan": ["...", "...", "...", "..."],
    "why_it_works": "...",
    "invite_text": "..."
  },
  "privacy_note": "Private simulation. Not a prediction. Connected signals stay private unless shared with consent.",
  "research_note": "Uses relationship-specific signals like responsiveness, appreciation, conflict repair, commitment, and logistics."
}

Rules:
- Be specific, cinematic, Gen-Z-readable, and product-demo impressive.
- Do not say soulmates, guarantee, predict, probability of success, or compatibility prediction.
- Confidence means context coverage, not relationship success.
- Use the exact six chemistry dimension names listed above.
- Use exactly four scenarios with the scenario titles listed above.
- Make the best_date actionable and low-pressure.
"""


def _extract_json_object(text: str) -> dict[str, Any]:
    text = text.strip()
    fence = re.match(r"^```(?:json)?\s*([\s\S]*?)\s*```$", text)
    if fence:
        text = fence.group(1).strip()
    if text.startswith("{"):
        return json.loads(text)
    start = text.find("{")
    end = text.rfind("}")
    if start >= 0 and end > start:
        return json.loads(text[start : end + 1])
    return json.loads(text)


def _future_us_llm() -> tuple[str, str, str] | None:
    # Prefer OpenRouter for this feature because the user can select free/cheap models.
    if settings.openrouter_api_key:
        return settings.openrouter_api_key, settings.openrouter_base_url, settings.openrouter_model
    if settings.cerebras_api_key:
        return settings.cerebras_api_key, settings.cerebras_base_url, settings.cerebras_model
    if settings.openai_api_key:
        return settings.openai_api_key, settings.openai_base_url, settings.openai_model
    return None


def _fallback_future_us(req: FutureUsRequest) -> FutureUsResponse:
    match = req.match
    graph = match.persona_graph or {}
    maps = graph.get("location_context", {}) if isinstance(graph, dict) else {}
    food = graph.get("food_ordering_context", {}) if isinstance(graph, dict) else {}
    location = "North Quad Night Market"
    if isinstance(maps, dict) and maps.get("date_zone"):
        location = str(maps["date_zone"])
    elif isinstance(food, dict) and food.get("favorite_date_food"):
        location = f"Campus walk + {food['favorite_date_food']} stop"

    return FutureUsResponse(
        title="Future Us",
        subtitle="Private agents simulated possible dynamics — not a prediction.",
        match_name=match.name,
        couple_thesis="The Low-Pressure Chemistry Test",
        confidence=ContextConfidence(
            score=78 if graph else 54,
            label="High context confidence" if graph else "Limited context confidence",
            explanation="Confidence means opt-in context coverage, not the probability that a relationship succeeds.",
        ),
        connected_signals=[
            ConnectedSignal(source="AI Memory", status="Computed persona graph", confidence=86, insight="Uses contextualized preferences, communication style, and emotional pacing from opt-in assistant memory summaries."),
            ConnectedSignal(source="Location Context", status="Routine overlap", confidence=82, insight=f"Compiles a realistic meeting zone around {location}."),
            ConnectedSignal(source="Food Ordering", status="Food comfort", confidence=80, insight="Turns repeat orders into a low-pressure snack anchor."),
            ConnectedSignal(source="Music Context", status="Vibe resonance", confidence=72, insight="Uses listening mood to avoid a first date that feels off-tempo."),
            ConnectedSignal(source="Calendar", status="Energy window", confidence=76, insight="Chooses a time that fits routines instead of forcing peak-social performance."),
        ],
        chemistry_map=[
            ChemistryDimension(name="Rhythm Fit", score=82, signal="Their routines can support a bounded midweek meet.", opportunity="Keep date one under 90 minutes."),
            ChemistryDimension(name="Emotional Safety", score=79, signal="Both respond best to clear intent with playful delivery.", opportunity="Use one sincere line before the joke."),
            ChemistryDimension(name="Novelty + Growth", score=81, signal="The pair has enough difference to feel expansive.", opportunity="Add a tiny optional second stop."),
            ChemistryDimension(name="Conflict Repair", score=74, signal="A likely misread is busyness being read as low interest.", opportunity="Normalize quick repair language."),
            ChemistryDimension(name="Intention Alignment", score=80, signal="Both can try something real without heavy labels.", opportunity="Call it a vibe test, not a destiny test."),
            ChemistryDimension(name="Practical Logistics", score=85, signal="The date can be compiled from location, time, and food constraints.", opportunity="Choose one easy meeting zone."),
        ],
        scenarios=[
            FutureUsScenario(title="Natural Overlap", timeframe="Next Wednesday · 7:10 PM", prompt="Where do routines cross?", simulation=f"The private agents converge around {location}, a public spot with an easy exit and optional second stop.", best_move="Send one specific bounded invite.", watchout="Do not make the plan feel over-engineered."),
            FutureUsScenario(title="First Misread", timeframe="After message two", prompt="What could go sideways?", simulation="Delayed replies could be misread as low interest if nobody names their rhythm.", best_move="Pair humor with one clear sentence of intent.", watchout="Avoid testing interest with silence."),
            FutureUsScenario(title="Repair Moment", timeframe="Week two", prompt="How do they recover?", simulation="A small acknowledgement plus a concrete next plan restores momentum.", best_move="Say what happened, what you meant, and what you want next.", watchout="Do not turn logistics into a character judgment."),
            FutureUsScenario(title="Growth Arc", timeframe="30 days", prompt="What could improve?", simulation="The connection nudges both people toward more direct asks and better follow-through.", best_move="Create one repeatable low-pressure ritual.", watchout="Keep novelty fun, not performative."),
        ],
        best_date=BestDatePlan(
            title="Compiled First Date: The 70-Minute Signal Test",
            location=location,
            suggested_time="Next Wednesday · 7:10 PM",
            plan=["Meet outside the venue", "Grab one shareable snack or drink", "Walk for twelve minutes", "End while the energy is still rising"],
            why_it_works="It combines responsiveness, appreciation, rhythm, repair, and logistics instead of pretending profile similarity predicts love.",
            invite_text=f"Want to test Future Us? {location}, Wednesday 7:10 — one snack, short walk, zero interview energy.",
        ),
        privacy_note="Private simulation. Not a prediction. Connected signals stay private unless shared with consent.",
        research_note="Uses relationship-specific signals like responsiveness, appreciation, conflict repair, commitment, and logistics.",
    )


async def build_future_us_simulation(req: FutureUsRequest) -> FutureUsResponse:
    llm = _future_us_llm()
    if not llm:
        return _fallback_future_us(req)

    api_key, base_url, model = llm
    user_payload = {
        "user": {
            "bio": req.user_bio,
            "demo_persona_graph": {
                "ai_memory_summary": [
                    "Cares about building impressive software and tends to overthink whether the other person is genuinely interested.",
                    "Likes concrete plans, gym consistency, ramen/late-night food, and people who communicate directly.",
                ],
                "location_context": {"frequent_places": ["CS building", "campus gym", "late-night ramen row"], "date_zone": "North Quad / ramen row"},
                "food_ordering_context": {"repeat_orders": ["tonkotsu ramen", "mango lassi", "protein bowls"], "favorite_date_food": "ramen"},
                "music_context": {"top_moods": ["focus beats", "Bollywood nostalgia", "main-character night walks"]},
                "calendar_context": {"free_windows": ["Wednesday 7 PM", "Friday after 8 PM"], "energy_notes": "Best after gym or after a build session ships."},
                "activity_context": {"routine": "Apple Watch shows gym streak + late-night walks", "date_energy": "active first date is fine if there is food after"},
                "in_app_message_context": {"pattern": "fast when excited, analytical when nervous", "repair_hint": "responds well to direct reassurance"},
            },
        },
        "match": req.match.model_dump(),
    }

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            r = await client.post(
                f"{base_url.rstrip('/')}/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "Ditto Future Us Demo",
                },
                json={
                    "model": model,
                    "temperature": 0.72,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": json.dumps(user_payload, ensure_ascii=False)},
                    ],
                },
            )
            r.raise_for_status()
            data = r.json()
            raw = data["choices"][0]["message"]["content"]
    except (httpx.HTTPError, KeyError, TypeError, ValueError):
        return _fallback_future_us(req)

    try:
        parsed = _extract_json_object(raw)
        out = FutureUsResponse.model_validate(parsed)
    except (json.JSONDecodeError, ValidationError, KeyError, TypeError, ValueError):
        return _fallback_future_us(req)

    return out
