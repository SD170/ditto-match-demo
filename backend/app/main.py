from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.schemas import MatchRequest, MatchResponse, Person
from app.data import load_men, load_women
from app.services.matcher import (
    LLM_UPSTREAM_USER_MESSAGE,
    LlmRateLimitedError,
    find_match,
)


@asynccontextmanager
async def lifespan(_: FastAPI):
    load_men()
    load_women()
    yield


app = FastAPI(title="Ditto AI Demo API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


def _normalize_gender(gender: str) -> str:
    g = gender.strip().lower()
    if g in ("men", "man", "m"):
        return "men"
    if g in ("women", "woman", "w", "f"):
        return "women"
    raise HTTPException(status_code=400, detail="gender must be men or women")


@app.get("/api/pool", response_model=list[Person])
async def get_pool(
    gender: str = Query(..., description="Which pool: men or women"),
    age_min: int | None = Query(None, ge=18, le=120),
    age_max: int | None = Query(None, ge=18, le=120),
) -> list[Person]:
    if age_min is not None and age_max is not None and age_min > age_max:
        raise HTTPException(status_code=400, detail="age_min must be <= age_max")

    which = _normalize_gender(gender)
    pool = list(load_men() if which == "men" else load_women())

    if age_min is not None:
        pool = [p for p in pool if p.age >= age_min]
    if age_max is not None:
        pool = [p for p in pool if p.age <= age_max]

    return pool


@app.post("/api/match", response_model=MatchResponse)
async def match(req: MatchRequest) -> MatchResponse:
    try:
        return await find_match(req)
    except ValueError as e:
        raise HTTPException(400, str(e)) from e
    except LlmRateLimitedError as e:
        raise HTTPException(429, str(e)) from e
    except httpx.HTTPStatusError as e:
        raise HTTPException(502, LLM_UPSTREAM_USER_MESSAGE) from e
    except httpx.RequestError:
        raise HTTPException(502, LLM_UPSTREAM_USER_MESSAGE)
    except Exception as e:
        raise HTTPException(500, str(e)) from e
