from pathlib import Path
from typing import Iterable


def chunk_text(text: str, chunk_size: int = 800, overlap: int = 100) -> list[str]:
    if chunk_size <= overlap: raise ValueError("chunk_size must exceed overlap")
    chunks = []
    start = 0
    while start < len(text):
        end = min(len(text), start + chunk_size)
        chunks.append(text[start:end])
        if end == len(text): break
        start = end - overlap
    return chunks


def ingest_documents(directory: str) -> list[dict]:
    documents = []
    for path in sorted(Path(directory).glob("**/*.txt")):
        content = path.read_text(encoding="utf-8")
        documents.append({"title": path.name, "doc_type": "agriculture", "content": content, "chunks": chunk_text(content)})
    return documents


def retrieve(documents: Iterable[dict], query: str, limit: int = 4) -> list[dict]:
    terms = {term.lower() for term in query.split() if len(term) > 2}
    ranked = []
    for document in documents:
        text = document.get("content", "").lower()
        score = sum(text.count(term) for term in terms)
        if score: ranked.append((score, document))
    return [document for _, document in sorted(ranked, key=lambda item: item[0], reverse=True)[:limit]]
