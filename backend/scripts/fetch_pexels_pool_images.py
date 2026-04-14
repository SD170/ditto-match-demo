#!/usr/bin/env python3
"""
Fetch portrait images from Pexels Search API and write `src` URLs into men.json / women.json.

Requires PEXELS_API_KEY in backend/.env (see https://www.pexels.com/api/).

Usage (from repo root or backend/):
  cd backend && python scripts/fetch_pexels_pool_images.py
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

import httpx
from dotenv import load_dotenv

BACKEND_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = BACKEND_ROOT / "app" / "data"

WOMEN_QUERY = "woman portrait professional headshot"
MEN_QUERY = "man portrait professional headshot"
PEXELS_SEARCH = "https://api.pexels.com/v1/search"
# CDN params: smaller than original / large2x, still sharp on retina cards (~400css px wide)
_PEXELS_IMG_QS = "auto=compress&cs=tinysrgb&w=800&dpr=1"


def _compress_pexels_cdn_url(url: str) -> str:
    if not url or "images.pexels.com" not in url:
        return url
    parts = urlsplit(url.split("?")[0])
    return urlunsplit((parts.scheme, parts.netloc, parts.path, _PEXELS_IMG_QS, ""))


def best_src(photo: dict) -> str:
    """Prefer `large` from API, then add CDN compression (not `original`)."""
    s = photo.get("src") or {}
    base = (
        s.get("large")
        or s.get("large2x")
        or s.get("medium")
        or s.get("original")
        or ""
    )
    return _compress_pexels_cdn_url(base) if base else ""


def fetch_photos(
    client: httpx.Client,
    api_key: str,
    *,
    query: str,
    need: int,
) -> list[str]:
    """Portrait-oriented search; paginate until `need` URLs collected."""
    urls: list[str] = []
    page = 1
    while len(urls) < need:
        r = client.get(
            PEXELS_SEARCH,
            params={
                "query": query,
                "per_page": min(80, need * 2),
                "page": page,
                "orientation": "portrait",
            },
            headers={"Authorization": api_key},
            timeout=30.0,
        )
        r.raise_for_status()
        data = r.json()
        batch = data.get("photos") or []
        if not batch:
            break
        for p in batch:
            u = best_src(p)
            if u and u not in urls:
                urls.append(u)
            if len(urls) >= need:
                break
        page += 1
        if page > 10:
            break
    return urls[:need]


def patch_file(path: Path, urls: list[str], *, gender_label: str) -> None:
    rows = json.loads(path.read_text(encoding="utf-8"))
    if len(urls) < len(rows):
        print(f"Warning: only {len(urls)} {gender_label} photos for {len(rows)} profiles.", file=sys.stderr)
    for i, row in enumerate(rows):
        if i < len(urls):
            row["image"] = urls[i]
    path.write_text(json.dumps(rows, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {min(len(urls), len(rows))} images -> {path.relative_to(BACKEND_ROOT)}")


def main() -> None:
    load_dotenv(BACKEND_ROOT / ".env")
    key = os.environ.get("PEXELS_API_KEY", "").strip()
    if not key:
        print("Set PEXELS_API_KEY in backend/.env", file=sys.stderr)
        sys.exit(1)

    women_path = DATA_DIR / "women.json"
    men_path = DATA_DIR / "men.json"
    n_women = len(json.loads(women_path.read_text(encoding="utf-8")))
    n_men = len(json.loads(men_path.read_text(encoding="utf-8")))

    with httpx.Client() as client:
        women_urls = fetch_photos(client, key, query=WOMEN_QUERY, need=n_women)
        men_urls = fetch_photos(client, key, query=MEN_QUERY, need=n_men)

    patch_file(women_path, women_urls, gender_label="women")
    patch_file(men_path, men_urls, gender_label="men")


if __name__ == "__main__":
    main()
