import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderLogado.css'; 

function HeaderLogado() {
  const navigate = useNavigate();

  return (
    <header className="header-logado">
      <div className="hl-logo" onClick={() => navigate('/home')}>
        <img src="/logo-lumiere.png" alt="Lumiere Sun Logo" className="logo-img" />
        <span className="hl-text">LUMIÈRE</span>
      </div>

      <nav className="hl-nav">
        <button className="hl-item"><span className="hl-icon">🏠</span> Início</button>
        <button className="hl-item"><span className="hl-icon">🧭</span> Descobrir</button>
        <button className="hl-item"><span className="hl-icon">🎬</span> Filmes</button>
        <button className="hl-item"><span className="hl-icon">↗️</span> Em Alta</button>
        <button className="hl-item"><span className="hl-icon">≣</span> Listas</button>
      </nav>

      <div className="hl-actions">
        <button className="hl-btn-icon">✨</button>
        <button className="hl-btn-icon">🔍</button>
        <div className="hl-notification-box">
            <button className="hl-btn-icon active-icon">🔔</button>
            <span className="hl-dot"></span>
        </div>
        <button className="hl-btn-icon">👤</button>
      </div>
    </header>
  );
}

export default HeaderLogado;