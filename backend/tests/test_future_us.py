from fastapi.testclient import TestClient

from app.main import app
from app.schemas import FutureUsRequest, Person
from app.services.future_us import build_future_us_simulation


def test_future_us_service_returns_private_simulation_with_relationship_science_sections() -> None:
    match = Person(
        name="Maya Singh",
        age=20,
        bio="Gap year before med — volunteering at a clinic and obsessed with soup dumplings.",
        image="https://example.com/maya.jpg",
    )
    req = FutureUsRequest(
        user_bio="CS student, night owl, gym streak, loves live music and low pressure first dates.",
        match=match,
    )

    simulation = build_future_us_simulation(req)

    assert simulation.match_name == "Maya Singh"
    assert simulation.title == "Future Us"
    assert simulation.confidence.score == 82
    assert "not a prediction" in simulation.privacy_note.lower()
    assert {signal.source for signal in simulation.connected_signals} >= {
        "ChatGPT Memory",
        "Google Maps",
        "Calendar",
        "Spotify",
        "Food Orders",
    }
    assert [dimension.name for dimension in simulation.chemistry_map] == [
        "Rhythm Fit",
        "Emotional Safety",
        "Novelty + Growth",
        "Conflict Repair",
        "Intention Alignment",
        "Practical Logistics",
    ]
    assert len(simulation.scenarios) == 4
    assert simulation.best_date.title
    assert simulation.best_date.invite_text.startswith("Want to test")


def test_future_us_endpoint_returns_simulation_payload() -> None:
    client = TestClient(app)

    response = client.post(
        "/api/future-us/simulate",
        json={
            "user_bio": "I build apps, go to the gym, overthink texts, and love ramen after late lectures.",
            "match": {
                "name": "Riley Thompson",
                "age": 22,
                "bio": "Art history + iced latte dependency. Museum sprint champion.",
                "image": "https://example.com/riley.jpg",
            },
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["title"] == "Future Us"
    assert body["match_name"] == "Riley Thompson"
    assert body["confidence"]["label"] == "High context confidence"
    assert body["best_date"]["location"]
