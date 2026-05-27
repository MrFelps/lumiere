"""
agente_recomendacao.py
Agente de recomendação com consulta em tempo real à API do TMDB.
Dev 3 — Leticia | Projeto Filmes - Grupo 7

Como funciona:
    1. O usuário responde o quiz (múltipla escolha)
    2. Cada resposta mapeia para gêneros do TMDB
    3. O agente consulta o TMDB em tempo real com esses gêneros
    4. Retorna uma lista de filmes recomendados atualizada
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

TMDB_TOKEN = os.getenv("TMDB_API_TOKEN")
BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE = "https://image.tmdb.org/t/p"

HEADERS = {
    "Authorization": f"Bearer {TMDB_TOKEN}",
    "accept": "application/json",
}


# ─── QUIZ ───────────────────────────────────────────────────────

QUIZ = [
    {
        "id": "humor",
        "pergunta": "Como você está se sentindo agora?",
        "opcoes": [
            {"id": "animado",    "texto": "Animado 🤩"},
            {"id": "relaxado",   "texto": "Relaxado 😌"},
            {"id": "pensativo",  "texto": "Pensativo 🤔"},
            {"id": "estressado", "texto": "Estressado 😤"},
        ]
    },
    {
        "id": "sentimento",
        "pergunta": "O que você quer sentir assistindo?",
        "opcoes": [
            {"id": "rir",        "texto": "Rir 😂"},
            {"id": "chorar",     "texto": "Chorar 😢"},
            {"id": "adrenalina", "texto": "Adrenalina 😱"},
            {"id": "pensar",     "texto": "Me fazer pensar 🧠"},
        ]
    },
    {
        "id": "companhia",
        "pergunta": "Vai assistir com quem?",
        "opcoes": [
            {"id": "sozinho", "texto": "Sozinho 🙋"},
            {"id": "crush",   "texto": "Com o crush 💕"},
            {"id": "familia", "texto": "Com a família 👨‍👩‍👧"},
            {"id": "amigos",  "texto": "Com amigos 👯"},
        ]
    },
    {
        "id": "tempo",
        "pergunta": "Quanto tempo você tem?",
        "opcoes": [
            {"id": "pouco",  "texto": "Cerca de 1 hora ⏱️"},
            {"id": "medio",  "texto": "Cerca de 2 horas 🕐"},
            {"id": "livre",  "texto": "Tanto faz ♾️"},
        ]
    },
    {
        "id": "estilo",
        "pergunta": "Prefere algo:",
        "opcoes": [
            {"id": "real",      "texto": "Baseado em fatos reais 📰"},
            {"id": "ficticio",  "texto": "Totalmente fictício 🚀"},
            {"id": "tanto_faz", "texto": "Tanto faz 🎲"},
        ]
    },
    {
        "id": "epoca",
        "pergunta": "Prefere filmes:",
        "opcoes": [
            {"id": "classicos",   "texto": "Clássicos 🎞️"},
            {"id": "lancamentos", "texto": "Lançamentos 🆕"},
            {"id": "tanto_faz",   "texto": "Tanto faz 🎬"},
        ]
    },
    {
        "id": "ritmo",
        "pergunta": "Que tipo de história você quer?",
        "opcoes": [
            {"id": "leve",      "texto": "Leve e descompromissada 🌸"},
            {"id": "intensa",   "texto": "Intensa e envolvente 🔥"},
            {"id": "suspense",  "texto": "Suspense e mistério 🕵️"},
            {"id": "emocional", "texto": "Emocionante e reflexiva 💭"},
        ]
    },
]


# ─── MAPEAMENTO RESPOSTAS → GÊNEROS TMDB ────────────────────────
# IDs de gênero: 28=Ação, 35=Comédia, 18=Drama, 27=Terror,
# 878=Ficção Científica, 10749=Romance, 16=Animação, 53=Thriller,
# 99=Documentário, 9648=Mistério, 10751=Família, 12=Aventura, 14=Fantasia

MAPEAMENTO = {
    "animado":    {28: 2, 12: 2, 35: 1},
    "relaxado":   {35: 2, 10749: 1, 16: 1},
    "pensativo":  {18: 2, 99: 2, 9648: 1},
    "estressado": {35: 3, 16: 2, 10751: 1},

    "rir":        {35: 3, 16: 1, 10751: 1},
    "chorar":     {18: 3, 10749: 2},
    "adrenalina": {28: 3, 53: 2, 27: 1},
    "pensar":     {878: 3, 99: 2, 9648: 2},

    "sozinho":    {18: 1, 9648: 1, 878: 1},
    "crush":      {10749: 3, 35: 2},
    "familia":    {10751: 3, 16: 2, 12: 1},
    "amigos":     {35: 2, 28: 2, 12: 1},

    "pouco":      {35: 1, 16: 1},
    "medio":      {28: 1, 18: 1},
    "livre":      {},

    "real":       {99: 3, 18: 1},
    "ficticio":   {878: 2, 14: 2, 12: 1},
    "tanto_faz":  {},

    "classicos":   {},
    "lancamentos": {},

    "leve":      {35: 2, 10749: 1, 16: 1},
    "intensa":   {28: 2, 18: 2, 53: 1},
    "suspense":  {53: 3, 9648: 3, 27: 1},
    "emocional": {18: 3, 10749: 1, 99: 1},
}


# ─── FILTRO DE ÉPOCA ────────────────────────────────────────────

FILTRO_EPOCA = {
    "classicos":   {"release_date.lte": "2000-12-31"},
    "lancamentos": {"release_date.gte": "2020-01-01"},
    "tanto_faz":   {},
}


# ─── LÓGICA DO AGENTE ───────────────────────────────────────────

def calcular_generos(respostas: dict) -> list:
    """Calcula a pontuação de cada gênero com base nas respostas do quiz."""
    pontuacao = {}
    for resposta_id in respostas.values():
        for genre_id, pontos in MAPEAMENTO.get(resposta_id, {}).items():
            pontuacao[genre_id] = pontuacao.get(genre_id, 0) + pontos
    return sorted(pontuacao.items(), key=lambda x: x[1], reverse=True)


def poster_url(path: str | None, size: str = "w342") -> str | None:
    if not path:
        return None
    return f"{IMAGE_BASE}/{size}{path}"


def consultar_tmdb(genre_ids: list, epoca: str, limite: int = 4) -> list:
    """
    Consulta o TMDB em tempo real usando o endpoint /discover/movie.
    Filtra por gêneros, época e retorna filmes bem avaliados.
    """
    params = {
        "language": "pt-BR",
        "sort_by": "popularity.desc",
        "vote_average.gte": 6.0,
        "vote_count.gte": 100,
        "include_adult": False,
        "with_genres": ",".join(str(g) for g in genre_ids),
    }

    # Aplica filtro de época se necessário
    params.update(FILTRO_EPOCA.get(epoca, {}))

    response = requests.get(f"{BASE_URL}/discover/movie", headers=HEADERS, params=params)
    response.raise_for_status()
    data = response.json()

    filmes = []
    for m in data.get("results", [])[:limite]:
        filmes.append({
            "id": m["id"],
            "title": m.get("title"),
            "overview": m.get("overview"),
            "release_date": m.get("release_date"),
            "vote_average": round(m.get("vote_average", 0), 1),
            "poster_url": poster_url(m.get("poster_path")),
            "genre_ids": m.get("genre_ids", []),
        })

    return filmes


def recomendar(respostas: dict, limite: int = 4) -> list:
    """
    Função principal do agente.
    Recebe respostas do quiz e retorna filmes recomendados consultando o TMDB.
    """
    if not TMDB_TOKEN:
        print("❌ Token do TMDB não encontrado! Verifique o arquivo .env")
        return []

    # 1. Calcular gêneros prioritários
    generos_pontuados = calcular_generos(respostas)
    top_generos = [g[0] for g in generos_pontuados[:3]]
    epoca = respostas.get("epoca", "tanto_faz")

    print(f"\n🎯 Gêneros identificados: {top_generos}")
    print(f"📅 Filtro de época: {epoca}")
    print(f"🌐 Consultando TMDB em tempo real...")

    # 2. Consultar TMDB com os gêneros identificados
    try:
        filmes = consultar_tmdb(genre_ids=top_generos, epoca=epoca, limite=limite)
    except Exception as e:
        print(f"❌ Erro ao consultar TMDB: {e}")
        return []

    return filmes


# ─── TESTE LOCAL ─────────────────────────────────────────────────

if __name__ == "__main__":
    print("🎬 Agente de Recomendação — Teste Local\n")

    respostas_exemplo = {
        "humor":      "estressado",
        "sentimento": "rir",
        "companhia":  "amigos",
        "tempo":      "medio",
        "estilo":     "tanto_faz",
        "epoca":      "lancamentos",
        "ritmo":      "leve",
    }

    print("📋 Respostas do quiz:")
    for pergunta, resposta in respostas_exemplo.items():
        print(f"   {pergunta}: {resposta}")

    recomendados = recomendar(respostas_exemplo, limite=4)

    print(f"\n🍿 Filmes recomendados ({len(recomendados)}):\n")
    for i, filme in enumerate(recomendados, 1):
        print(f"  {i}. {filme['title']} ({filme.get('release_date', '')[:4]})")
        print(f"     ⭐ {filme.get('vote_average')} | 🎭 Gêneros: {filme.get('genre_ids')}")
        print(f"     📝 {filme.get('overview', '')[:80]}...")
        print()
