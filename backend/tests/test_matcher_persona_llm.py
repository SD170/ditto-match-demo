import asyncio
import json
from pathlib import Path

import httpx

from app.schemas import MatchRequest, Person
from app.services import matcher
from app.services.rag import retrieve_profiles


def make_person(name: str, age: int, bio: str, graph: dict) -> Person:
    return Person(name=name, age=age, bio=bio, image=f"https://example.com/{name}.jpg", persona_graph=graph)


def test_retrieve_profiles_uses_computed_persona_graph_context() -> None:
    generic_foodie = make_person(
        "Ari",
        22,
        "student who likes weekends",
        {
            "ai_memory_summary": ["Craves soup dumplings after stressful weeks and likes bounded walks."],
            "food_ordering_context": {"repeat_orders": ["soup dumplings", "ginger tea"]},
        },
    )
    unrelated = make_person(
        "Blake",
        22,
        "student who likes weekends",
        {"music_context": {"top_moods": ["metal"]}},
    )

    ranked = retrieve_profiles("I want soup dumplings and a calm walk", [unrelated, generic_foodie], top_k=1)

    assert ranked[0].name == "Ari"


def test_matcher_prefers_openrouter_and_sends_rich_full_pool(monkeypatch) -> None:
    candidates = [
        make_person(
            "Maya Singh",
            20,
            "volunteers at a clinic and loves soup dumplings",
            {
                "ai_memory_summary": ["Values directness and low-pressure food plans."],
                "conversational_llm_notes": {"values": ["warmth", "follow-through"]},
                "food_ordering_context": {"repeat_orders": ["soup dumplings"]},
                "activity_context": {"routine": "walks after clinic shifts"},
            },
        ),
        make_person(
            "Riley Stone",
            21,
            "art student who loves museums",
            {
                "ai_memory_summary": ["Gets excited by visual humor and museum games."],
                "conversational_llm_notes": {"values": ["curiosity", "playfulness"]},
                "location_context": {"frequent_places": ["campus gallery"]},
            },
        ),
        make_person(
            "Nova Lee",
            22,
            "robotics builder",
            {
                "ai_memory_summary": ["Likes structured evening plans and tinkering rituals."],
                "calendar_context": {"free_windows": ["Wednesday 7 PM"]},
            },
        ),
    ]
    captured = {}

    class FakeAsyncClient:
        def __init__(self, *args, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, tb):
            return None

        async def post(self, url, headers, json):
            captured["url"] = url
            captured["headers"] = headers
            captured["json"] = json
            return httpx.Response(
                200,
                request=httpx.Request("POST", url),
                json={
                    "choices": [
                        {
                            "message": {
                                "content": json_module.dumps(
                                    {
                                        "match": candidates[0].model_dump(),
                                        "reason": "Maya fits the user's calm food ritual and direct communication style, with enough practical overlap for a real Wednesday plan.",
                                        "date_plan": "Split soup dumplings, then take a short decompression walk near campus.",
                                        "location": "Bao Alley + North Quad Loop",
                                        "suggested_time": "Next Wednesday 7:00 PM",
                                    }
                                )
                            }
                        }
                    ]
                },
            )

    json_module = json
    monkeypatch.setattr(matcher.settings, "openrouter_api_key", "test-openrouter-key", raising=False)
    monkeypatch.setattr(matcher.settings, "openrouter_base_url", "https://openrouter.ai/api/v1", raising=False)
    monkeypatch.setattr(matcher.settings, "openrouter_model", "openai/gpt-oss-20b:free", raising=False)
    monkeypatch.setattr(matcher.settings, "cerebras_api_key", None)
    monkeypatch.setattr(matcher.settings, "openai_api_key", None)
    monkeypatch.setattr(matcher.settings, "rag_top_k", 40, raising=False)
    monkeypatch.setattr(matcher.httpx, "AsyncClient", FakeAsyncClient)

    import app.data

    monkeypatch.setattr(app.data, "load_pool", lambda _: tuple(candidates))

    req = MatchRequest(user_bio="I overthink texts, love soup dumplings, and want a low-pressure Wednesday walk.", age_min=18, age_max=25, seeking="women")
    result = asyncio.run(matcher.find_match(req))

    assert result.match.name == "Maya Singh"
    assert "openrouter.ai" in captured["url"]
    assert captured["json"]["model"] == "openai/gpt-oss-20b:free"
    user_payload = captured["json"]["messages"][1]["content"]
    assert "computed_persona_graph" in user_payload
    assert "food_ordering_context" in user_payload
    assert "conversational_llm_notes" in user_payload
    assert user_payload.count('"name"') == 3


def test_profile_data_keys_and_docs_are_demo_ready() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    repo_root = backend_root.parent
    data_paths = [backend_root / "app" / "data" / "men.json", backend_root / "app" / "data" / "women.json"]
    deprecated = {"claude_notes", "chatgpt_memory", "google_maps", "doordash", "spotify", "health_activity"}
    required = {
        "ai_memory_summary",
        "conversational_llm_notes",
        "location_context",
        "calendar_context",
        "food_ordering_context",
        "music_context",
        "activity_context",
        "in_app_message_context",
    }

    for path in data_paths:
        profiles = json.loads(path.read_text())
        assert profiles
        note_signatures = set()
        for profile in profiles:
            graph = profile["persona_graph"]
            assert required.issubset(graph.keys())
            assert deprecated.isdisjoint(graph.keys())
            note_signatures.add(json.dumps(graph["conversational_llm_notes"], sort_keys=True))
        assert len(note_signatures) >= 10

    doc = repo_root / "docs" / "future-us-persona-data.md"
    text = doc.read_text()
    assert "computed persona graph" in text.lower()
    assert "raw data" in text.lower()
    assert "Apple Watch" in text
    assert "previous in-app messages" in text
