import React, { useState } from 'react';
import HeaderLogado from '../../Components/HeaderLogado';
import './style.css';

const INITIAL_DATA = [
  { id: 1, user: 'Maria Silva', iniciais: 'MS', acao: 'curtiu sua avaliação de', alvo: 'A Viagem de Chihiro', tempo: '5 min atrás', tipo: 'curtida', lida: false },
  { id: 2, user: 'Carlos M.', iniciais: 'CM', acao: 'começou a seguir sua lista', alvo: 'Clássicos Imperdíveis', tempo: '1 hora atrás', tipo: 'seguidor', lida: false },
  { id: 3, user: 'Ana Costa', iniciais: 'AC', acao: 'começou a seguir você', alvo: '', tempo: '2 horas atrás', tipo: 'seguidor', lida: false },
  { id: 4, user: 'Pedro Oliveira', iniciais: 'PO', acao: 'comentou na sua avaliação de', alvo: 'Parasita', tempo: '3 horas atrás', tipo: 'comentario', lida: true },
  { id: 5, user: 'Lucas Santos', iniciais: 'LS', acao: 'curtiu sua lista', alvo: 'Para Chorar', tempo: '5 horas atrás', tipo: 'curtida', lida: true },
];

function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState(INITIAL_DATA);
  const [filtro, setFiltro] = useState('Todas');

  const handleDeleteAll = () => setNotificacoes([]);
  const handleMarkAllAsRead = () => setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
  const handleDelete = (id) => setNotificacoes(prev => prev.filter(n => n.id !== id));
  const handleToggleReadStatus = (id) => {
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: !n.lida } : n));
  };

  const notificacoesExibidas = notificacoes.filter(n => {
    if (filtro === 'Todas') return true;
    if (filtro === 'Não Lidas') return !n.lida;
    if (filtro === 'Curtidas') return n.tipo === 'curtida';
    if (filtro === 'Comentários') return n.tipo === 'comentario';
    if (filtro === 'Seguidores') return n.tipo === 'seguidor';
    return true;
  });

  const naoLidasCount = notificacoes.filter(n => !n.lida).length;

  const renderIcon = (tipo) => {
    switch (tipo) {
      case 'curtida': return '⭐';
      case 'comentario': return '💬'; 
      case 'seguidor': return '👥'; 
      default: return '●';
    }
  };

  return (
    <div className="notificacoes-container">
      <HeaderLogado />
      
      <main className="notificacoes-main">
        <header className="notificacoes-top-bar">
          <div className="title-section">
            <span className="bell-icon">🔔</span>
            <div>
              <h1 className="notificacoes-title">Notificações</h1>
              <p className="notificacoes-subtitle">Você tem {naoLidasCount} não lidas</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn-outline" onClick={handleMarkAllAsRead} title="Marcar todas como lidas">✓✓</button>
            <button className="icon-btn-outline" onClick={handleDeleteAll} title="Apagar todas">🗑️</button>
          </div>
        </header>

        <nav className="notificacoes-filters">
          {['Todas', 'Não Lidas', 'Curtidas', 'Comentários', 'Seguidores'].map(f => (
            <button 
              key={f} 
              className={`filter-btn ${filtro === f ? 'active' : ''}`}
              onClick={() => setFiltro(f)}
            >
              {f}
            </button>
          ))}
        </nav>

        <section className="notificacoes-list">
          {notificacoesExibidas.length > 0 ? (
            notificacoesExibidas.map(notif => (
              <div key={notif.id} className={`notificacao-card ${notif.lida ? '' : 'unread'}`}>
                <div className="card-left">
                  <div className="type-icon-container">
                    <span className="type-icon">{renderIcon(notif.tipo)}</span>
                  </div>
                  <div className="user-avatar">{notif.iniciais}</div>
                  <div className="notif-text">
                    <p><strong className="user-name">{notif.user}</strong> {notif.acao} <span className="movie-highlight">{notif.alvo}</span></p>
                    <span className="notif-time">{notif.tempo}</span>
                  </div>
                </div>
                <div className="card-right">
                  <button 
                    className={`action-small-outline ${notif.lida ? 'is-read' : 'is-unread'}`} 
                    onClick={() => handleToggleReadStatus(notif.id)}
                    title={notif.lida ? "Marcar como não lida" : "Marcar como lida"}
                  >
                    {notif.lida ? '👁️‍🗨️' : '✓'} 
                  </button>
                  <button 
                    className="action-small-outline" 
                    onClick={() => handleDelete(notif.id)}
                    title="Apagar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-msg">Nenhuma notificação encontrada para este filtro.</p>
          )}
        </section>

        <div className="load-more-container">
          <button className="btn-load-more">Carregar Mais Notificações</button>
        </div>
      </main>
    </div>
  );
}

export default Notificacoes;