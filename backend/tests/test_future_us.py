import asyncio
import json

import httpx
from fastapi.testclient import TestClient

from app.main import app
from app.schemas import FutureUsRequest, Person
from app.services import future_us


def rich_person() -> Person:
    return Person(
        name="Maya Singh",
        age=20,
        bio="Gap year before med — volunteering at a clinic and obsessed with soup dumplings.",
        image="https://example.com/maya.jpg",
        persona_graph={
            "ai_memory_summary": ["Gets calmer when plans have a soft exit", "Values consistent follow-through over intense flirting"],
            "location_context": {"frequent_places": ["North Quad Clinic", "Bao Alley", "Riverside Walk"]},
            "food_ordering_context": {"repeat_orders": ["soup dumplings", "ginger tea"]},
            "music_context": {"top_moods": ["soft indie", "study focus"]},
            "calendar_context": {"free_windows": ["Wednesday 7 PM", "Sunday afternoon"]},
        },
    )


def llm_payload() -> dict:
    return {
        "title": "Future Us",
        "subtitle": "Private agents simulated possible dynamics — not a prediction.",
        "match_name": "Maya Singh",
        "couple_thesis": "The Soup Dumpling Soft Launch",
        "confidence": {
            "score": 86,
            "label": "High context confidence",
            "explanation": "The agents had enough opt-in context to reason about rhythm, repair, food, and logistics.",
        },
        "connected_signals": [
            {"source": "AI Memory", "status": "Opt-in persona graph", "insight": "Both prefer clear intent over performative mystery.", "confidence": 91},
            {"source": "Location Context", "status": "Routine overlap", "insight": "Bao Alley sits between both evening paths.", "confidence": 84},
            {"source": "Food Ordering", "status": "Comfort food signal", "insight": "Soup dumplings are a low-pressure shared ritual.", "confidence": 88},
            {"source": "Music Context", "status": "Vibe resonance", "insight": "Soft indie plus study focus creates calm first-date energy.", "confidence": 74},
            {"source": "Calendar", "status": "Energy window", "insight": "Wednesday 7 PM is available without sleep debt.", "confidence": 79},
        ],
        "chemistry_map": [
            {"name": "Rhythm Fit", "score": 87, "signal": "Midweek overlap with similar decompression rituals.", "opportunity": "Keep the first date bounded and easy to exit."},
            {"name": "Emotional Safety", "score": 82, "signal": "Both respond to warmth plus specificity.", "opportunity": "Name intent without making it heavy."},
            {"name": "Novelty + Growth", "score": 78, "signal": "Enough difference to teach each other small rituals.", "opportunity": "Add one tiny new stop after the safe food anchor."},
            {"name": "Conflict Repair", "score": 76, "signal": "Likely friction is delayed texts after busy shifts.", "opportunity": "Normalize quick repair language early."},
            {"name": "Intention Alignment", "score": 81, "signal": "Both want realness without instant relationship theater.", "opportunity": "Call it a vibe test, not a destiny test."},
            {"name": "Practical Logistics", "score": 89, "signal": "The route and food constraints are unusually compatible.", "opportunity": "Meet near Bao Alley, then optional walk."},
        ],
        "scenarios": [
            {"title": "Natural Overlap", "timeframe": "Next Wednesday · 7:10 PM", "prompt": "Where do routines cross?", "simulation": "They meet near Bao Alley after clinic and lab hours.", "best_move": "Send one bounded invite.", "watchout": "Do not make the plan feel too engineered."},
            {"title": "First Misread", "timeframe": "After message two", "prompt": "What could go sideways?", "simulation": "A late reply could look like low interest.", "best_move": "Explain the shift schedule lightly.", "watchout": "Avoid testing each other with silence."},
            {"title": "Repair Moment", "timeframe": "Week two", "prompt": "How do they recover?", "simulation": "A small apology plus a concrete next plan restores momentum.", "best_move": "Name the miss and suggest Bao Alley round two.", "watchout": "Do not over-apologize into awkwardness."},
            {"title": "Growth Arc", "timeframe": "30 days", "prompt": "What could improve?", "simulation": "They become more punctual and less afraid of direct asks.", "best_move": "Make a weekly low-pressure ritual.", "watchout": "Keep novelty from becoming homework."},
        ],
        "best_date": {
            "title": "Compiled First Date: Dumplings + Decompression Loop",
            "location": "Bao Alley + Riverside Walk",
            "suggested_time": "Next Wednesday · 7:10 PM",
            "plan": ["Meet outside Bao Alley", "Split dumplings", "Walk twelve minutes", "End before it drags"],
            "why_it_works": "It turns food comfort, route overlap, and repair-friendly pacing into one low-pressure plan.",
            "invite_text": "Want to test Future Us? Bao Alley, Wednesday 7:10 — dumplings, a short walk, zero interview energy.",
        },
        "privacy_note": "Private simulation. Not a prediction. Connected signals stay private unless shared with consent.",
        "research_note": "Uses relationship-specific signals like responsiveness, appreciation, conflict repair, commitment, and logistics.",
    }


def test_future_us_uses_openrouter_llm_and_rich_persona_graph(monkeypatch) -> None:
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
                json={"choices": [{"message": {"content": json_module.dumps(llm_payload())}}]},
            )

    json_module = json
    monkeypatch.setattr(future_us.settings, "openrouter_api_key", "test-openrouter-key", raising=False)
    monkeypatch.setattr(future_us.settings, "openrouter_base_url", "https://openrouter.ai/api/v1", raising=False)
    monkeypatch.setattr(future_us.settings, "openrouter_model", "openai/gpt-oss-20b:free", raising=False)
    monkeypatch.setattr(future_us.settings, "openai_api_key", None)
    monkeypatch.setattr(future_us.httpx, "AsyncClient", FakeAsyncClient)

    req = FutureUsRequest(user_bio="CS student who overthinks texts but loves ramen and gym streaks.", match=rich_person())
    simulation = asyncio.run(future_us.build_future_us_simulation(req))

    assert simulation.match_name == "Maya Singh"
    assert simulation.couple_thesis == "The Soup Dumpling Soft Launch"
    assert "openrouter.ai" in captured["url"]
    assert captured["json"]["model"] == "openai/gpt-oss-20b:free"
    sent = captured["json"]["messages"][1]["content"]
    assert "persona_graph" in sent
    assert "food_ordering_context" in sent
    assert "not a prediction" in captured["json"]["messages"][0]["content"].lower()


def test_future_us_endpoint_returns_simulation_payload(monkeypatch) -> None:
    monkeypatch.setattr(future_us.settings, "openrouter_api_key", None, raising=False)
    monkeypatch.setattr(future_us.settings, "openai_api_key", None)
    client = TestClient(app)

    response = client.post(
        "/api/future-us/simulate",
        json={
            "user_bio": "I build apps, go to the gym, overthink texts, and love ramen after late lectures.",
            "match": rich_person().model_dump(),
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["title"] == "Future Us"
    assert body["match_name"] == "Maya Singh"
    assert body["confidence"]["label"] == "High context confidence"
    assert body["best_date"]["location"]
