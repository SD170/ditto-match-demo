import json
from pathlib import Path

from app.schemas import Person

_DATA_DIR = Path(__file__).resolve().parent


def load_men() -> tuple[Person, ...]:
    """Read from disk each call so JSON edits (e.g. image URLs) show up without a full process restart."""
    raw = json.loads((_DATA_DIR / "men.json").read_text(encoding="utf-8"))
    return tuple(Person.model_validate(p) for p in raw)


def load_women() -> tuple[Person, ...]:
    raw = json.loads((_DATA_DIR / "women.json").read_text(encoding="utf-8"))
    return tuple(Person.model_validate(p) for p in raw)


def load_pool(seeking: str) -> tuple[Person, ...]:
    if seeking == "men":
        return load_men()
    return load_women()
