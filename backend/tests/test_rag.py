from app.schemas import Person
from app.services.rag import retrieve_profiles


def test_retrieve_profiles_orders_by_bm25_overlap() -> None:
    knitting = Person(name="A", age=20, bio="loves knitting and tea", image="")
    pythoner = Person(name="B", age=21, bio="python engineer, coffee, late nights", image="")
    ranked = retrieve_profiles("python developer startup", [knitting, pythoner], top_k=1)
    assert ranked[0].name == "B"
