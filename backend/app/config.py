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

    # Lexical RAG (BM25): max profiles passed to the LLM after retrieval
    rag_top_k: int = 12

    # Optional: https://www.pexels.com/api/ — used by scripts/fetch_pexels_pool_images.py
    pexels_api_key: str | None = None

    # Dev: force the same error path as a real 429 (no API call). Env: SIMULATE_LLM_RATE_LIMIT=true
    simulate_llm_rate_limit: bool = False


settings = Settings()
