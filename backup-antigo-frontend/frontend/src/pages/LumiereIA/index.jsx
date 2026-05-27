import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import './style.css';

function LumiereIA() {
  const navigate = useNavigate();
  const [horaAtual, setHoraAtual] = useState('');

  useEffect(() => {
    const atualizarHora = () => {
      const agora = new Date();
      setHoraAtual(agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };

    atualizarHora();
    const intervalo = setInterval(atualizarHora, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const handleClose = () => navigate('/home');

  return (
    <div className="ia-container">
      <HeaderLogado />
      <main className="ia-main">
        <header className="ia-header">
          <div className="ia-header-info">
            <div className="ia-logo-circle">✨</div>
            <div>
              <h1 className="ia-title">Lumière AI</h1>
              <p className="ia-subtitle">Assistente Cinematográfica</p>
            </div>
          </div>
          <button className="ia-close-btn" onClick={handleClose} title="Fechar e ir para Início">✕</button>
        </header>

        <div className="ia-content-area">
          <section className="ia-chat-history">
            <div className="ia-message">
              <div className="ia-message-header"><span className="ia-message-icon">✨</span><span className="ia-message-sender">Lumière AI</span></div>
              <p className="ia-message-text">Seja bem-vindo à Lumière!</p>
              <span className="ia-message-time">{horaAtual}</span>
            </div>
            <div className="ia-message">
              <div className="ia-message-header"><span className="ia-message-icon">✨</span><span className="ia-message-sender">Lumière AI</span></div>
              <p className="ia-message-text">Sou a IA do Lumière, sua assistente cinematográfica. Posso ajudar você a encontrar filmes perfeitos, criar listas personalizadas e descobrir novas obras-primas do cinema! 🍿</p>
              <span className="ia-message-time">{horaAtual}</span>
            </div>
          </section>

          <section className="ia-suggestions-section">
            <h2 className="ia-suggestions-title">💡 O que você gostaria de saber?</h2>
            <div className="ia-suggestions-grid">
              <button className="ia-suggestion-card"><div className="suggestion-icon">🎬</div><div className="suggestion-text"><h3>Me recomende um filme de ficção científica</h3><p>Explorar o universo da ficção científica</p></div></button>
              <button className="ia-suggestion-card"><div className="suggestion-icon">⭐</div><div className="suggestion-text"><h3>Quais são os filmes mais bem avaliados?</h3><p>Descobrir obras-primas do cinema</p></div></button>
              <button className="ia-suggestion-card"><div className="suggestion-icon">📝</div><div className="suggestion-text"><h3>Ajude-me a criar uma lista temática</h3><p>Organizar filmes por temas</p></div></button>
              <button className="ia-suggestion-card"><div className="suggestion-icon">🔍</div><div className="suggestion-text"><h3>Encontre filmes parecidos com Inception</h3><p>Recomendações baseadas em filmes</p></div></button>
            </div>
          </section>
        </div>

        <div className="ia-footer-warning">
          <span>✨ Lumière AI é um protótipo visual. Funcionalidades em desenvolvimento.</span>
        </div>
      </main>
    </div>
  );
}

export default LumiereIA;