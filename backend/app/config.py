from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Cerebras Inference (OpenAI-compatible): https://inference-docs.cerebras.ai/resources/openai
    cerebras_api_key: str | None = None
    cerebras_base_url: str = "https://api.cerebras.ai/v1"
    cerebras_model: str = "qwen-3-235b-a22b-instruct-2507"

    openai_api_key: str | None = None
    openai_base_url: str = "https://api.openai.com/v1"
    openai_model: str = "gpt-4o-mini"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # OpenRouter is useful for cheap/free demo calls. Free model IDs change over time;
    # override OPENROUTER_MODEL in .env if needed.
    openrouter_api_key: str | None = None
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    openrouter_model: str = "openai/gpt-oss-20b:free"

    # Lightweight hybrid retrieval: the demo pools are only ~20 profiles, so the
    # LLM can usually see the whole age-filtered pool after BM25/persona ordering.
    rag_top_k: int = 40

    # Optional: https://www.pexels.com/api/ — used by scripts/fetch_pexels_pool_images.py
    pexels_api_key: str | None = None

    # Dev: force the same error path as a real 429 (no API call). Env: SIMULATE_LLM_RATE_LIMIT=true
    simulate_llm_rate_limit: bool = False


settings = Settings()
