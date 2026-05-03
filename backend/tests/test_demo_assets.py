from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def test_data_connect_screen_exists_and_is_wired_into_matches_page() -> None:
    root = repo_root()
    component = root / "frontend" / "src" / "components" / "match" / "DataConnectPanel.tsx"
    matches = root / "frontend" / "src" / "pages" / "MatchesPage.tsx"

    text = component.read_text()
    assert "Connect your context" in text
    assert "Context score" in text
    assert "Connected" in text
    assert "AI Memory" in text
    assert "Apple Watch" in text
    assert "previous in-app messages" in text
    assert "setConnectedIds" in text

    matches_text = matches.read_text()
    assert "DataConnectPanel" in matches_text
    assert "<DataConnectPanel" in matches_text


def test_demo_script_covers_riley_ice_cream_flow_and_code_walkthrough() -> None:
    script = repo_root() / "docs" / "future-us-demo-script.md"
    text = script.read_text()
    required_phrases = [
        "Riley Thompson",
        "ice cream",
        "Creative Chess Match",
        "Campus Gallery + Corner Market loop",
        "computed persona graph",
        "backend/app/data/women.json",
        "backend/app/services/rag.py",
        "backend/app/services/matcher.py",
        "backend/app/services/future_us.py",
        "OpenRouter",
        "not a prediction",
        "privacy",
        "Apple Watch",
        "previous in-app messages",
    ]
    for phrase in required_phrases:
        assert phrase in text
