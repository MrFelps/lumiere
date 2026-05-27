import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderLogado.css'; 

function HeaderLogado() {
  const navigate = useNavigate();

  return (
    <header className="header-logado">
      <div className="hl-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
        <img src="/logo-lumiere.png" alt="Lumiere Sun Logo" className="logo-img" />
        <span className="logo-text">Lumière</span>
      </div>

      <nav className="hl-nav">
        <button className="hl-item" onClick={() => navigate('/home')}><span className="hl-icon">🏠</span> Início</button>
        <button className="hl-item" onClick={() => navigate('/descobrir')}><span className="hl-icon">🧭</span> Descobrir</button>
        <button className="hl-item" onClick={() => navigate('/filmes')}><span className="hl-icon">🎬</span> Filmes</button>
        <button className="hl-item" onClick={() => navigate('/em-alta')}><span className="hl-icon">↗️</span> Em Alta</button>
        <button className="hl-item" onClick={() => navigate('/listas')}><span className="hl-icon">≣</span> Listas</button>
      </nav>

      <div className="hl-actions">
        <button className="hl-btn-icon" onClick={() => navigate('/ia')} title="Lumière AI">✨</button>
        <button className="hl-btn-icon" onClick={() => navigate('/busca')} title="Buscar">🔍</button>        
        <div className="hl-notification-box" onClick={() => navigate('/notificacoes')} style={{ cursor: 'pointer' }} title="Notificações">
            <button className="hl-btn-icon active-icon">🔔</button>
            <span className="hl-dot"></span>
        </div>
        
        <button className="hl-btn-icon" onClick={() => navigate('/perfil')} title="Meu Perfil">👤</button>
      </div>
    </header>
  );
}

export default HeaderLogado;