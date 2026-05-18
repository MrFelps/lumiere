"""
agente_recomendacao.py
Lógica do agente de recomendação baseada no quiz de personalidade.
Dev 3 — Leticia | Projeto Filmes - Grupo 7

Como funciona:
    1. O usuário responde o quiz (múltipla escolha)
    2. Cada resposta mapeia para gêneros do TMDB
    3. O agente busca nos JSONs os filmes que melhor combinam
    4. Retorna uma lista de recomendações personalizada
"""

import json
from pathlib import Path

MOCK_DIR = Path("mock")

# ─── QUIZ ───────────────────────────────────────────────────────
# Estrutura do quiz — perguntas e opções
# Cada opção tem um peso de gêneros do TMDB associado

QUIZ = [
    {
        "id": "humor",
        "pergunta": "Como você está se sentindo agora?",
        "opcoes": [
            {"id": "animado",   "texto": "Animado 🤩"},
            {"id": "relaxado",  "texto": "Relaxado 😌"},
            {"id": "pensativo", "texto": "Pensativo 🤔"},
            {"id": "estressado","texto": "Estressado 😤"},
        ]
    },
    {
        "id": "sentimento",
        "pergunta": "O que você quer sentir assistindo?",
        "opcoes": [
            {"id": "rir",       "texto": "Rir 😂"},
            {"id": "chorar",    "texto": "Chorar 😢"},
            {"id": "adrenalina","texto": "Adrenalina 😱"},
            {"id": "pensar",    "texto": "Me fazer pensar 🧠"},
        ]
    },
    {
        "id": "companhia",
        "pergunta": "Vai assistir com quem?",
        "opcoes": [
            {"id": "sozinho",  "texto": "Sozinho 🙋"},
            {"id": "crush",    "texto": "Com o crush 💕"},
            {"id": "familia",  "texto": "Com a família 👨‍👩‍👧"},
            {"id": "amigos",   "texto": "Com amigos 👯"},
        ]
    },
    {
        "id": "tempo",
        "pergunta": "Quanto tempo você tem?",
        "opcoes": [
            {"id": "pouco",   "texto": "Cerca de 1 hora ⏱️"},
            {"id": "medio",   "texto": "Cerca de 2 horas 🕐"},
            {"id": "livre",   "texto": "Tanto faz ♾️"},
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
            {"id": "classicos",    "texto": "Clássicos 🎞️"},
            {"id": "lancamentos",  "texto": "Lançamentos 🆕"},
            {"id": "tanto_faz",    "texto": "Tanto faz 🎬"},
        ]
    },
    {
        "id": "ritmo",
        "pergunta": "Que tipo de história você quer?",
        "opcoes": [
            {"id": "leve",       "texto": "Leve e descompromissada 🌸"},
            {"id": "intensa",    "texto": "Intensa e envolvente 🔥"},
            {"id": "suspense",   "texto": "Suspense e mistério 🕵️"},
            {"id": "emocional",  "texto": "Emocionante e reflexiva 💭"},
        ]
    },
]


# ─── MAPEAMENTO RESPOSTAS → GÊNEROS TMDB ────────────────────────
# Cada resposta do quiz adiciona pontos aos gêneros correspondentes
# IDs de gênero do TMDB: 28=Ação, 35=Comédia, 18=Drama, 27=Terror,
# 878=Ficção Científica, 10749=Romance, 16=Animação, 53=Thriller,
# 99=Documentário, 9648=Mistério, 10751=Família, 12=Aventura

MAPEAMENTO = {
    # humor
    "animado":    {28: 2, 12: 2, 35: 1},           # Ação, Aventura, Comédia
    "relaxado":   {35: 2, 10749: 1, 16: 1},         # Comédia, Romance, Animação
    "pensativo":  {18: 2, 99: 2, 9648: 1},          # Drama, Documentário, Mistério
    "estressado": {35: 3, 16: 2, 10751: 1},         # Comédia, Animação, Família

    # sentimento
    "rir":        {35: 3, 16: 1, 10751: 1},         # Comédia, Animação, Família
    "chorar":     {18: 3, 10749: 2},                # Drama, Romance
    "adrenalina": {28: 3, 53: 2, 27: 1},            # Ação, Thriller, Terror
    "pensar":     {878: 3, 99: 2, 9648: 2},         # Ficção Científica, Documentário, Mistério

    # companhia
    "sozinho":    {18: 1, 9648: 1, 878: 1},         # Drama, Mistério, Ficção
    "crush":      {10749: 3, 35: 2},                # Romance, Comédia
    "familia":    {10751: 3, 16: 2, 12: 1},         # Família, Animação, Aventura
    "amigos":     {35: 2, 28: 2, 12: 1},            # Comédia, Ação, Aventura

    # tempo (filtra por duração aproximada — usado como bônus)
    "pouco":      {35: 1, 16: 1},                   # Preferência por filmes mais curtos
    "medio":      {28: 1, 18: 1},
    "livre":      {},                               # Sem preferência

    # estilo
    "real":       {99: 3, 18: 1},                   # Documentário, Drama
    "ficticio":   {878: 2, 14: 2, 12: 1},           # Ficção Científica, Fantasia, Aventura
    "tanto_faz":  {},

    # época (não muda gênero, usado para filtrar ano depois)
    "classicos":   {},
    "lancamentos": {},
    "tanto_faz":   {},

    # ritmo
    "leve":      {35: 2, 10749: 1, 16: 1},          # Comédia, Romance, Animação
    "intensa":   {28: 2, 18: 2, 53: 1},             # Ação, Drama, Thriller
    "suspense":  {53: 3, 9648: 3, 27: 1},           # Thriller, Mistério, Terror
    "emocional": {18: 3, 10749: 1, 99: 1},          # Drama, Romance, Documentário
}


# ─── LÓGICA DO AGENTE ───────────────────────────────────────────

def calcular_generos(respostas: dict) -> list[tuple[int, int]]:
    """
    Recebe as respostas do quiz e calcula a pontuação de cada gênero.
    Retorna lista de (genre_id, pontuação) ordenada do maior para o menor.

    Exemplo de respostas:
    {
        "humor": "animado",
        "sentimento": "adrenalina",
        "companhia": "amigos",
        "tempo": "medio",
        "estilo": "ficticio",
        "epoca": "lancamentos",
        "ritmo": "intensa"
    }
    """
    pontuacao = {}

    for pergunta_id, resposta_id in respostas.items():
        generos = MAPEAMENTO.get(resposta_id, {})
        for genre_id, pontos in generos.items():
            pontuacao[genre_id] = pontuacao.get(genre_id, 0) + pontos

    # Ordena do gênero com mais pontos para o menos
    return sorted(pontuacao.items(), key=lambda x: x[1], reverse=True)


def carregar_filmes() -> list:
    """Carrega os filmes do JSON gerado pelo fetch_tmdb.py."""
    caminho = MOCK_DIR / "filmes.json"
    if not caminho.exists():
        print("❌ Arquivo mock/filmes.json não encontrado. Rode o fetch_tmdb.py primeiro.")
        return []
    with open(caminho, "r", encoding="utf-8") as f:
        return json.load(f)


def carregar_discover() -> dict:
    """Carrega os filmes separados por gênero."""
    caminho = MOCK_DIR / "discover_por_genero.json"
    if not caminho.exists():
        return {}
    with open(caminho, "r", encoding="utf-8") as f:
        return json.load(f)


def filtrar_por_epoca(filmes: list, epoca: str) -> list:
    """Filtra filmes por época se o usuário tiver preferência."""
    if epoca == "classicos":
        return [f for f in filmes if f.get("release_date", "")[:4] <= "2000"]
    elif epoca == "lancamentos":
        return [f for f in filmes if f.get("release_date", "")[:4] >= "2020"]
    return filmes  # tanto_faz — sem filtro


def recomendar(respostas: dict, limite: int = 4) -> list:
    """
    Função principal do agente.
    Recebe respostas do quiz e retorna lista de filmes recomendados.
    """
    # 1. Calcular gêneros prioritários com base nas respostas
    generos_pontuados = calcular_generos(respostas)
    top_generos = [g[0] for g in generos_pontuados[:3]]  # top 3 gêneros

    print(f"\n🎯 Gêneros identificados: {top_generos}")

    # 2. Carregar filmes disponíveis
    todos_filmes = carregar_filmes()
    if not todos_filmes:
        return []

    # 3. Pontuar cada filme com base nos gêneros
    filmes_pontuados = []
    for filme in todos_filmes:
        genre_ids = filme.get("genre_ids", [])
        pontos = 0
        for genre_id, score in generos_pontuados:
            if genre_id in genre_ids:
                pontos += score
        if pontos > 0:
            filmes_pontuados.append({**filme, "_pontos": pontos})

    # 4. Ordenar por pontuação (depois por nota do TMDB como critério de desempate)
    filmes_pontuados.sort(key=lambda f: (f["_pontos"], f.get("vote_average", 0)), reverse=True)

    # 5. Filtrar por época se necessário
    epoca = respostas.get("epoca", "tanto_faz")
    filmes_pontuados = filtrar_por_epoca(filmes_pontuados, epoca)

    # 6. Remover campo interno de pontuação e retornar
    recomendados = []
    for filme in filmes_pontuados[:limite]:
        filme.pop("_pontos", None)
        recomendados.append(filme)

    return recomendados


# ─── TESTE LOCAL ─────────────────────────────────────────────────
# Rode: python agente_recomendacao.py
# para ver o agente funcionando com respostas de exemplo

if __name__ == "__main__":
    print("🎬 Agente de Recomendação — Teste Local\n")

    # Simula respostas do quiz
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
