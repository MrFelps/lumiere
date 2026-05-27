import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import axios from 'axios';
import './style.css';

const LOGGED_USER = { name: "João da Silva", handle: "@joaodasilva", initials: "JD" };

function LumiereIA() {
  const navigate = useNavigate();
  const [horaAtual, setHoraAtual] = useState('');
  
  // Chat messages state
  const [messages, setMessages] = useState([]);
  
  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 means quiz hasn't started
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [backendOffline, setBackendOffline] = useState(false);

  const chatEndRef = useRef(null);

  // Time formatter
  useEffect(() => {
    const atualizarHora = () => {
      const agora = new Date();
      setHoraAtual(agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };

    atualizarHora();
    const intervalo = setInterval(atualizarHora, 1000);
    
    // Initial greetings
    setMessages([
      {
        id: 'greet-1',
        sender: 'ai',
        text: 'Seja bem-vindo ao assistente inteligente do Lumière! ✨',
        time: agoraFormatted()
      },
      {
        id: 'greet-2',
        sender: 'ai',
        text: 'Sou a IA da Lumiere, sua assistente cinematográfica pessoal. Posso te ajudar a encontrar as melhores obras no TMDB com base no seu humor atual! 🍿🎬',
        time: agoraFormatted(),
        showActions: true // Show the "Start Quiz" button
      }
    ]);

    return () => clearInterval(intervalo);
  }, []);

  // Scroll to bottom whenever messages list grows
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const agoraFormatted = () => {
    const agora = new Date();
    return agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Start the quiz
  const startQuiz = async () => {
    setLoading(true);
    setBackendOffline(false);
    
    // Append user initiating message
    setMessages(prev => [
      ...prev.map(m => m.id === 'greet-2' ? { ...m, showActions: false } : m),
      {
        id: 'user-start',
        sender: 'user',
        text: 'Quero recomendações personalizadas! Iniciar quiz 🚀',
        time: agoraFormatted()
      }
    ]);

    try {
      // Connect to Python FastAPI Backend to fetch Leticia's quiz questions
      const response = await axios.get('http://127.0.0.1:8000/ia/quiz');
      const questions = response.data;
      setQuizQuestions(questions);
      
      // Post the first question
      setLoading(false);
      setCurrentQuestionIndex(0);
      
      setMessages(prev => [
        ...prev,
        {
          id: `question-${questions[0].id}`,
          sender: 'ai',
          text: `**Pergunta 1:** ${questions[0].pergunta}`,
          options: questions[0].opcoes,
          time: agoraFormatted()
        }
      ]);
    } catch (error) {
      console.error("FastAPI Backend offline:", error);
      setLoading(false);
      setBackendOffline(true);
      
      setMessages(prev => [
        ...prev,
        {
          id: 'error-offline',
          sender: 'ai',
          text: '⚠️ Não foi possível conectar ao **Servidor Python (FastAPI)**. Para rodar o agente inteligente de recomendação em tempo real, inicie o backend Python digitando: \n\n`cd backend && python main.py`\n\nEnquanto isso, você pode continuar navegando pelos filmes do TMDB diretamente no catálogo!',
          time: agoraFormatted(),
          showActions: true // allow trying again
        }
      ]);
    }
  };

  // Handle Quiz answer click
  const handleAnswerSelect = async (questionId, optionId, optionText) => {
    // Hide actions/options for the answered question
    setMessages(prev => prev.map(m => m.id === `question-${questionId}` ? { ...m, options: null } : m));

    // Save answer
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);

    // Append user's choice to chat
    setMessages(prev => [
      ...prev,
      {
        id: `user-answer-${questionId}`,
        sender: 'user',
        text: optionText,
        time: agoraFormatted()
      }
    ]);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quizQuestions.length) {
      // Ask next question
      setCurrentQuestionIndex(nextIndex);
      const nextQ = quizQuestions[nextIndex];
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: `question-${nextQ.id}`,
            sender: 'ai',
            text: `**Pergunta ${nextIndex + 1}:** ${nextQ.pergunta}`,
            options: nextQ.opcoes,
            time: agoraFormatted()
          }
        ]);
      }, 400);
    } else {
      // Finished the quiz! Send answers to Python agent to fetch TMDB movies in real-time
      setCurrentQuestionIndex(-1);
      setLoading(true);
      
      setTimeout(async () => {
        setMessages(prev => [
          ...prev,
          {
            id: 'ai-processing',
            sender: 'ai',
            text: 'Excelente! Recebi suas respostas. Estou rodando o algoritmo do agente e buscando as melhores indicações no **TMDB em tempo real**... 🧠🍿',
            time: agoraFormatted()
          }
        ]);
        
        try {
          // Request recommendations from FastAPI
          const response = await axios.post('http://127.0.0.1:8000/ia/recomendar', {
            respostas: newAnswers
          });
          
          const recomendados = response.data.recomendados;
          setLoading(false);

          if (recomendados && recomendados.length > 0) {
            setMessages(prev => [
              ...prev,
              {
                id: 'ai-results-message',
                sender: 'ai',
                text: 'Prontinho! Aqui estão as 4 obras que mais combinam com o que você procura hoje. Clique em qualquer card para ver mais detalhes!',
                time: agoraFormatted(),
                movies: recomendados
              }
            ]);
          } else {
            setMessages(prev => [
              ...prev,
              {
                id: 'ai-results-empty',
                sender: 'ai',
                text: 'Curioso! O TMDB não retornou filmes para essa exata combinação. Vamos tentar novamente com outras escolhas?',
                time: agoraFormatted(),
                showActions: true
              }
            ]);
          }
        } catch (error) {
          console.error("Erro ao enviar respostas para a API:", error);
          setLoading(false);
          setMessages(prev => [
            ...prev,
            {
              id: 'ai-results-error',
              sender: 'ai',
              text: 'Desculpe, ocorreu um erro de conexão com o agente ao processar as recomendações. Vamos tentar de novo?',
              time: agoraFormatted(),
              showActions: true
            }
          ]);
        }
      }, 800);
    }
  };

  const handleClose = () => navigate('/home');

  return (
    <div className="ia-container">
      <HeaderLogado />
      <main className="ia-main">
        <header className="ia-header">
          <div className="ia-header-info">
            <div className="ia-logo-circle">✨</div>
            <div>
              <h1 className="ia-title">LumIA</h1>
              <p className="ia-subtitle">Conectado ao Agente Python FastAPI</p>
            </div>
          </div>
          <button className="ia-close-btn" onClick={handleClose} title="Fechar e ir para Início">✕</button>
        </header>

        <div className="ia-content-area" style={{ flex: 1, overflowY: 'auto', gap: '20px' }}>
          <div className="ia-chat-history">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`ia-message-wrapper ${m.sender === 'user' ? 'user-aligned' : 'ai-aligned'}`}
              >
                <div className={`ia-message ${m.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                  {m.sender === 'ai' && (
                    <div className="ia-message-header">
                      <span className="ia-message-icon">✨</span>
                      <span className="ia-message-sender">LumIA</span>
                    </div>
                  )}
                  <p 
                    className="ia-message-text"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {m.text}
                  </p>
                  
                  {/* Option buttons inside chat bubble */}
                  {m.options && (
                    <div className="ia-options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                      {m.options.map((opt) => (
                        <button
                          key={opt.id}
                          className="ia-option-btn"
                          style={{
                            background: 'rgba(168, 107, 50, 0.12)',
                            border: '1px solid rgba(168, 107, 50, 0.3)',
                            borderRadius: '10px',
                            color: '#fff',
                            padding: '12px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            textAlign: 'left'
                          }}
                          onClick={() => handleAnswerSelect(m.id.replace('question-', ''), opt.id, opt.texto)}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#a86b32';
                            e.target.style.borderColor = '#c17d3d';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(168, 107, 50, 0.12)';
                            e.target.style.borderColor = 'rgba(168, 107, 50, 0.3)';
                          }}
                        >
                          {opt.texto}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Render movies suggestions inside chat! */}
                  {m.movies && (
                    <div className="ia-movies-results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '20px' }}>
                      {m.movies.map((movie) => (
                        <div 
                          key={movie.id}
                          className="ia-movie-card"
                          style={{
                            background: '#151515',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, border-color 0.2s',
                          }}
                          onClick={() => navigate(`/filme/${movie.id}`)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.borderColor = '#a86b32';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                          }}
                        >
                          <div style={{ position: 'relative', height: '180px' }}>
                            <img 
                              src={movie.poster_url || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400"} 
                              alt={movie.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.85)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', color: '#ffb300' }}>
                              ⭐ {movie.vote_average}
                            </div>
                          </div>
                          <div style={{ padding: '12px' }}>
                            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>{movie.title}</h4>
                            <span style={{ fontSize: '0.75rem', color: '#888' }}>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                            <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: '#aaa', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>{movie.overview}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions buttons like "Start Quiz" */}
                  {m.showActions && (
                    <div style={{ marginTop: '16px' }}>
                      <button
                        className="btn-primary"
                        style={{
                          background: '#a86b32',
                          color: '#fff',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '10px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'background 0.2s'
                        }}
                        onClick={startQuiz}
                      >
                        ✨ Iniciar Recomendação Inteligente
                      </button>
                    </div>
                  )}

                  <span className="ia-message-time">{m.time}</span>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="ia-message-wrapper ai-aligned">
                <div className="ia-message ai-bubble" style={{ minWidth: '80px', padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center', height: '20px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#a86b32', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }}></div>
                    <div style={{ width: '8px', height: '8px', background: '#a86b32', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }}></div>
                    <div style={{ width: '8px', height: '8px', background: '#a86b32', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="ia-footer-warning" style={{ padding: '15px 20px', background: '#070707' }}>
          <span>🐍 Python Backend rodando em `localhost:8000` • Front-end integrado ao TMDB</span>
        </div>
      </main>

      <style>{`
        .ia-message-wrapper {
          display: flex;
          width: 100%;
          margin-bottom: 8px;
        }
        .ai-aligned {
          justify-content: flex-start;
        }
        .user-aligned {
          justify-content: flex-end;
        }
        .ai-bubble {
          border-top-left-radius: 6px;
        }
        .user-bubble {
          background-color: #a86b32;
          border-color: rgba(255,255,255,0.1);
          border-radius: 20px;
          border-top-right-radius: 6px;
          color: #fff;
          max-width: 75%;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
          padding: 16px 20px;
        }
        .user-bubble .ia-message-text {
          color: #fff;
        }
        .user-bubble .ia-message-time {
          color: rgba(255,255,255,0.6);
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
}

export default LumiereIA;