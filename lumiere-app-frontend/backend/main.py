from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
from agente_recomendacao import recomendar, QUIZ

app = FastAPI(title="CineApp API", version="1.0.0")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuizRespostas(BaseModel):
    respostas: Dict[str, str]

@app.get("/")
def root():
    return {"message": "CineApp API rodando!"}

@app.get("/ia/quiz")
def obter_quiz():
    """Retorna as perguntas do quiz do agente de recomendacao."""
    return QUIZ

@app.post("/ia/recomendar")
def obter_recomendacoes(dados: QuizRespostas):
    """Recebe as respostas do quiz e retorna recomendacoes do TMDB em tempo real."""
    print("Respostas recebidas pelo agente:", dados.respostas)
    filmes = recomendar(dados.respostas, limite=4)
    return {"recomendados": filmes}

