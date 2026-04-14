# Ditto AI

Demo “one thoughtful match” web app: a **React + Vite** frontend talks to a **FastAPI** backend that **BM25-retrieves** a small slice of a fixed profile pool, then asks an **LLM** (Cerebras or OpenAI-compatible) to pick one person and write the pitch. No separate `/docs` site; this file plus the in-app **About** page (`/about`) are the overview.

## What it is (30 seconds)

- **Data**: Synthetic JSON profiles (`backend/app/data/*.json`). Portrait URLs are stock-style (e.g. Pexels); **no real users, no PII, not a production dating product.**
- **Flow**: User picks pool + age range → browses grid → writes a short “vibe” → **POST `/api/match`** returns a single `Person` plus LLM-written **reason**, **date_plan**, **location**, and **suggested_time**.
- **Without an API key**: the backend still returns a **fallback** match (first retrieved profile + canned copy) so the UI works for local demos.

```mermaid
flowchart LR
  subgraph client [Browser]
    SPA[React SPA]
  end
  subgraph server [FastAPI :8000]
    Pool["GET /api/pool"]
    Match["POST /api/match"]
    RAG[BM25 top-k]
    LLM[Chat completion]
  end
  SPA --> Pool
  SPA --> Match
  Match --> RAG
  RAG --> LLM
  LLM --> Match
```

## Run locally

**Backend** (Python 3.11+ recommended):

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # add at least one LLM key if you want real inference
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend** (Node 18+):

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (default **http://localhost:5173**). The dev server **proxies** `/api` and `/health` to `http://127.0.0.1:8000` (see `frontend/vite.config.ts`).

## Environment variables

Copy `backend/.env.example` → `backend/.env`. Pydantic loads from the process env; names are **UPPER_SNAKE** matching the fields in `backend/app/config.py`.

| Variable | Purpose |
|----------|---------|
| `CEREBRAS_API_KEY` | **Preferred** if set. OpenAI-compatible Cerebras Inference (`CEREBRAS_BASE_URL`, `CEREBRAS_MODEL`). |
| `OPENAI_API_KEY` | Used when Cerebras is unset. `OPENAI_BASE_URL` (default `https://api.openai.com/v1`), `OPENAI_MODEL` (default `gpt-4o-mini`). |
| `CORS_ORIGINS` | Comma-separated browser origins (default includes `http://localhost:5173`). |
| `RAG_TOP_K` | Max profiles passed to the LLM after BM25 (default `12`). |
| `PEXELS_API_KEY` | Optional; only for `scripts/fetch_pexels_pool_images.py`. |
| `SIMULATE_LLM_RATE_LIMIT` | `true` forces the rate-limit error path without calling the API (dev). |

## Tests

```bash
cd backend
pytest
```

Example: BM25 ordering is covered in `backend/tests/test_rag.py`.

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Known demo limits

- **`/api/match` spends LLM credits** when a key is configured: there is **no auth**, **no per-IP rate limit**, and **`user_bio` has no max length** in the schema. Treat this as a **local / trusted demo**, not a public production API.
- **Error responses**: Rate limits and upstream failures return user-oriented messages; **generic `500` responses may still include `str(exception)`** — fine for debugging, noisy if you expose the API publicly.
- **UI vs API**: The celebration modal surfaces **name, image, and reason**; the JSON also includes **date_plan**, **location**, and **suggested_time** (visible in network tab or API clients).
- **Deploy**: See [Deploy (Vercel + free API host)](#deploy-vercel--free-api-host) below.

## Deploy (Vercel + free API host)

**Why two hosts:** Vercel is ideal for the static/Vite frontend. FastAPI needs a long-lived Python process, so run the API on a small free **web service** (e.g. [Render](https://render.com) — free tier sleeps after idle; cold starts ~30–60s) or [Railway](https://railway.app) / [Fly.io](https://fly.io) with their free allowances.

### 1) Backend on Render (example)

1. Push this repo to GitHub.
2. Render → **New** → **Blueprint** (or **Web Service**). If using the included [`render.yaml`](render.yaml), connect the repo and approve the service.
3. In the Render dashboard, set **Environment**:
   - `CORS_ORIGINS` = your Vercel URL(s), comma-separated, e.g. `https://ditto-ai.vercel.app` (add `http://localhost:5173` if you still use local dev against prod API).
   - `CEREBRAS_API_KEY` and/or `OPENAI_API_KEY` (and any other vars from `.env.example`).
4. Deploy and copy the API URL (e.g. `https://ditto-api.onrender.com`).

Manual Web Service (no Blueprint): **Root Directory** = `backend`, build `pip install -r requirements.txt`, start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

### 2) Frontend on Vercel

1. [Vercel](https://vercel.com) → **Add New Project** → import the repo.
2. **Root Directory** = `frontend`.
3. **Environment Variables** (production — required for API calls):
   - `VITE_API_BASE_URL` = your Render API origin **without** a trailing slash, e.g. `https://ditto-api.onrender.com`
4. Deploy. Vite bakes this in at build time; bump a redeploy after changing it.

[`frontend/vercel.json`](frontend/vercel.json) rewrites client-side routes to `index.html` for React Router.

### 3) Local dev (unchanged)

Leave `VITE_API_BASE_URL` unset locally so requests stay relative and the Vite dev proxy hits `localhost:8000`.

## Security / data posture (one line)

**All profiles are fictional; images are stock/synthetic sources. No real user data is collected or stored by this demo.**
