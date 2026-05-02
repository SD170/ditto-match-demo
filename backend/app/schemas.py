from typing import Literal

from pydantic import BaseModel, Field, model_validator


class Person(BaseModel):
    name: str
    age: int
    bio: str
    image: str


class MatchRequest(BaseModel):
    user_bio: str = Field(..., min_length=1, description="Who they are / what they're about")
    age_min: int = Field(18, ge=18, le=120)
    age_max: int = Field(35, ge=18, le=120)
    seeking: Literal["men", "women"] = Field(
        ..., description="Pool to search: opposite or same depending on product rules"
    )

    @model_validator(mode="after")
    def ages_ordered(self) -> "MatchRequest":
        if self.age_min > self.age_max:
            raise ValueError("age_min must be <= age_max")
        return self


class MatchResponse(BaseModel):
    match: Person
    reason: str = Field(..., description="Why this pair works — poster-copy energy")
    date_plan: str = Field(..., description="One concrete date idea, playful but doable")
    location: str = Field(..., description="Specific vibe-y spot name (fictional campus OK)")
    suggested_time: str = Field(
        ..., description="e.g. Next Wednesday 7:00 PM — Ditto drop callback"
    )


class FutureUsRequest(BaseModel):
    user_bio: str = Field(..., min_length=1)
    match: Person


class ConnectedSignal(BaseModel):
    source: str
    status: str
    insight: str
    confidence: int = Field(..., ge=0, le=100)


class ContextConfidence(BaseModel):
    score: int = Field(..., ge=0, le=100)
    label: str
    explanation: str


class ChemistryDimension(BaseModel):
    name: str
    score: int = Field(..., ge=0, le=100)
    signal: str
    opportunity: str


class FutureUsScenario(BaseModel):
    title: str
    timeframe: str
    prompt: str
    simulation: str
    best_move: str
    watchout: str


class BestDatePlan(BaseModel):
    title: str
    location: str
    suggested_time: str
    plan: list[str]
    why_it_works: str
    invite_text: str


class FutureUsResponse(BaseModel):
    title: str
    subtitle: str
    match_name: str
    couple_thesis: str
    confidence: ContextConfidence
    connected_signals: list[ConnectedSignal]
    chemistry_map: list[ChemistryDimension]
    scenarios: list[FutureUsScenario]
    best_date: BestDatePlan
    privacy_note: str
    research_note: str
