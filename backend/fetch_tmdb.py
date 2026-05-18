"""
fetch_tmdb.py
Script para buscar dados do TMDB e gerar arquivos JSON.
Dev 3 — Leticia | Projeto Filmes - Grupo 7

Como usar:
    1. Instale as dependências: pip install requests python-dotenv
    2. Crie um arquivo .env com: TMDB_API_TOKEN=seu_token_aqui
    3. Execute: python fetch_tmdb.py
    4. Os JSONs serão gerados na pasta /mock
"""

import os
import json
import time
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

TMDB_TOKEN = os.getenv("TMDB_API_TOKEN")
BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE = "https://image.tmdb.org/t/p"
OUTPUT_DIR = Path("mock")

HEADERS = {
    "Authorization": f"Bearer {TMDB_TOKEN}",
    "accept": "application/json",
}


# ─── UTILITÁRIOS ────────────────────────────────────────────────

def get(endpoint: str, params: dict = {}) -> dict:
    """Faz uma requisição GET ao TMDB com delay para evitar rate limiting."""
    response = requests.get(f"{BASE_URL}{endpoint}", headers=HEADERS, params={"language": "pt-BR", **params})
    response.raise_for_status()
    time.sleep(0.3)  # evita rate limiting
    return response.json()


def poster_url(path: str | None, size: str = "w342") -> str | None:
    if not path:
        return None
    return f"{IMAGE_BASE}/{size}{path}"


def save_json(filename: str, data) -> None:
    filepath = OUTPUT_DIR / filename
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  ✅ Salvo: mock/{filename}")


# ─── FUNÇÕES DE BUSCA ───────────────────────────────────────────

def fetch_genres() -> list:
    """Busca todos os gêneros de filmes disponíveis."""
    data = get("/genre/movie/list")
    return data.get("genres", [])


def fetch_popular_movies(pages: int = 3) -> list:
    """Busca filmes populares (3 páginas = ~60 filmes)."""
    movies = []
    for page in range(1, pages + 1):
        data = get("/movie/popular", {"page": page})
        for m in data.get("results", []):
            movies.append({
                "id": m["id"],
                "title": m.get("title"),
                "overview": m.get("overview"),
                "release_date": m.get("release_date"),
                "vote_average": round(m.get("vote_average", 0), 1),
                "vote_count": m.get("vote_count"),
                "poster_url": poster_url(m.get("poster_path")),
                "backdrop_url": poster_url(m.get("backdrop_path"), "w780"),
                "genre_ids": m.get("genre_ids", []),
            })
    return movies


def fetch_movie_details(movie_id: int) -> dict:
    """Busca detalhes completos de um filme."""
    m = get(f"/movie/{movie_id}")
    return {
        "id": m["id"],
        "title": m.get("title"),
        "overview": m.get("overview"),
        "release_date": m.get("release_date"),
        "runtime": m.get("runtime"),
        "vote_average": round(m.get("vote_average", 0), 1),
        "vote_count": m.get("vote_count"),
        "tagline": m.get("tagline"),
        "status": m.get("status"),
        "poster_url": poster_url(m.get("poster_path"), "w500"),
        "backdrop_url": poster_url(m.get("backdrop_path"), "w780"),
        "genres": [{"id": g["id"], "name": g["name"]} for g in m.get("genres", [])],
    }


def fetch_movie_cast(movie_id: int, limit: int = 10) -> dict:
    """Busca elenco e diretor de um filme."""
    data = get(f"/movie/{movie_id}/credits")

    cast = [
        {
            "id": p["id"],
            "name": p.get("name"),
            "character": p.get("character"),
            "profile_url": poster_url(p.get("profile_path"), "w185"),
        }
        for p in data.get("cast", [])[:limit]
    ]

    directors = [
        {"id": p["id"], "name": p.get("name")}
        for p in data.get("crew", [])
        if p.get("job") == "Director"
    ]

    return {"cast": cast, "directors": directors}


def fetch_movie_recommendations(movie_id: int) -> list:
    """Busca filmes recomendados com base em um filme."""
    data = get(f"/movie/{movie_id}/recommendations")
    return [
        {
            "id": m["id"],
            "title": m.get("title"),
            "overview": m.get("overview"),
            "vote_average": round(m.get("vote_average", 0), 1),
            "poster_url": poster_url(m.get("poster_path")),
        }
        for m in data.get("results", [])[:8]
    ]


def fetch_discover(genre_ids: list[int], min_rating: float = 6.0) -> list:
    """Busca filmes por gênero — usado pelo agente de recomendação."""
    params = {
        "sort_by": "popularity.desc",
        "vote_average.gte": min_rating,
        "vote_count.gte": 100,
        "include_adult": False,
    }
    if genre_ids:
        params["with_genres"] = ",".join(str(g) for g in genre_ids)

    data = get("/discover/movie", params)
    return [
        {
            "id": m["id"],
            "title": m.get("title"),
            "overview": m.get("overview"),
            "vote_average": round(m.get("vote_average", 0), 1),
            "poster_url": poster_url(m.get("poster_path")),
            "genre_ids": m.get("genre_ids", []),
        }
        for m in data.get("results", [])[:20]
    ]


# ─── EXECUÇÃO PRINCIPAL ─────────────────────────────────────────

def main():
    print("\n🎬 Iniciando busca de dados no TMDB...\n")

    if not TMDB_TOKEN:
        print("❌ Token não encontrado! Crie um arquivo .env com TMDB_API_TOKEN=seu_token")
        return

    # 1. Gêneros
    print("📂 Buscando gêneros...")
    genres = fetch_genres()
    save_json("genres.json", genres)

    # 2. Filmes populares
    print("\n📂 Buscando filmes populares...")
    popular = fetch_popular_movies(pages=3)
    save_json("filmes.json", popular)

    # 3. Detalhes + elenco + recomendações dos primeiros 10 filmes
    print("\n📂 Buscando detalhes, elenco e recomendações dos 10 primeiros filmes...")
    detalhes_list = []

    for movie in popular[:10]:
        movie_id = movie["id"]
        title = movie["title"]
        print(f"  🎥 {title} (id: {movie_id})")

        details = fetch_movie_details(movie_id)
        cast = fetch_movie_cast(movie_id)
        recommendations = fetch_movie_recommendations(movie_id)

        details["cast"] = cast["cast"]
        details["directors"] = cast["directors"]
        details["recommendations"] = recommendations

        detalhes_list.append(details)

        # Salva arquivo individual por filme também
        save_json(f"filmes/{movie_id}.json", details)

    # Salva todos os detalhes em um único arquivo
    save_json("filmes_detalhes.json", detalhes_list)

    # 4. Discover por gêneros populares (para o agente de recomendação)
    print("\n📂 Buscando filmes por gênero (agente de recomendação)...")
    generos_para_buscar = {
        "acao": [28],
        "comedia": [35],
        "drama": [18],
        "terror": [27],
        "ficcao_cientifica": [878],
        "romance": [10749],
        "animacao": [16],
        "thriller": [53],
    }

    discover_data = {}
    for nome, ids in generos_para_buscar.items():
        print(f"  🎭 Gênero: {nome}")
        discover_data[nome] = fetch_discover(genre_ids=ids)

    save_json("discover_por_genero.json", discover_data)

    print("\n✅ Todos os arquivos JSON foram gerados na pasta /mock!")
    print("📁 Estrutura gerada:")
    print("   mock/")
    print("   ├── genres.json              → lista de gêneros")
    print("   ├── filmes.json              → filmes populares")
    print("   ├── filmes_detalhes.json     → detalhes dos 10 primeiros")
    print("   ├── discover_por_genero.json → filmes por gênero (para o agente)")
    print("   └── filmes/")
    print("       └── {id}.json            → detalhes individuais por filme")


if __name__ == "__main__":
    main()
