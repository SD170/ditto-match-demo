"""Lexical retrieval for Ditto matchmaking (BM25).

This is the same *shape* as production RAG: **retrieve** relevant chunks (here:
whole profiles), then **generate** with an LLM on that subset only — without a
vector DB. Okapi BM25 is a standard lexical ranker used in search and hybrid
RAG baselines; it scores query–document word overlap with length normalization.
"""

from __future__ import annotations

import math
import re
from collections import Counter
from typing import Sequence

from app.schemas import Person

_TOKEN_RE = re.compile(r"[a-z0-9]+", re.I)


def _tokenize(text: str) -> list[str]:
    return [m.group(0).lower() for m in _TOKEN_RE.finditer(text or "")]


def _bm25_scores(
    query: str,
    documents: list[str],
    *,
    k1: float = 1.5,
    b: float = 0.75,
) -> list[float]:
    """Okapi BM25; one score per document (higher = more relevant)."""
    q_terms = _tokenize(query)
    if not q_terms:
        return [0.0] * len(documents)

    doc_tokens = [_tokenize(d) for d in documents]
    n_docs = len(doc_tokens)
    if n_docs == 0:
        return []

    doc_lens = [len(toks) for toks in doc_tokens]
    avgdl = sum(doc_lens) / n_docs if n_docs else 0.0
    if avgdl == 0:
        return [0.0] * n_docs

    doc_freqs = [Counter(toks) for toks in doc_tokens]
    df: dict[str, int] = {}
    for c in doc_freqs:
        for term in c:
            df[term] = df.get(term, 0) + 1

    scores = [0.0] * n_docs
    for qi in q_terms:
        n_qi = df.get(qi, 0)
        if n_qi == 0:
            continue
        idf = math.log((n_docs - n_qi + 0.5) / (n_qi + 0.5) + 1.0)
        for i, c in enumerate(doc_freqs):
            f = c.get(qi, 0)
            if f == 0:
                continue
            dl = doc_lens[i]
            denom = f + k1 * (1.0 - b + b * dl / avgdl)
            scores[i] += idf * (f * (k1 + 1.0)) / denom

    return scores


def retrieve_profiles(
    query: str,
    candidates: Sequence[Person],
    top_k: int,
    *,
    k1: float = 1.5,
    b: float = 0.75,
) -> list[Person]:
    """Rank candidates by BM25(user_bio vs name+bio); return top_k.

    If there is no lexical signal (all scores 0), returns the full sequence
    unchanged so the LLM still sees every age-filtered profile.
    """
    cand_list = list(candidates)
    if not cand_list:
        return []
    if top_k <= 0 or len(cand_list) <= top_k:
        return cand_list

    docs = [f"{p.name} {p.bio}" for p in cand_list]
    scores = _bm25_scores(query, docs, k1=k1, b=b)
    if not scores or max(scores) <= 0.0:
        return cand_list

    order = sorted(range(len(cand_list)), key=lambda i: scores[i], reverse=True)
    return [cand_list[i] for i in order[:top_k]]
