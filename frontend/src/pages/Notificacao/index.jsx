import React, { useState } from 'react';
import HeaderLogado from '../../Components/HeaderLogado';
import './style.css';

// Dados iniciais
const INITIAL_DATA = [
  { id: 1, user: 'Maria Silva', iniciais: 'MS', acao: 'curtiu sua avaliação de', alvo: 'Inception', tempo: '5 min atrás', tipo: 'curtida', lida: false },
  { id: 2, user: 'João Santos', iniciais: 'JS', acao: 'comentou em', alvo: 'The Matrix', tempo: '1 hora atrás', tipo: 'comentario', lida: false },
  { id: 3, user: 'Ana Costa', iniciais: 'AC', acao: 'começou a seguir você', alvo: '', tempo: '2 horas atrás', tipo: 'seguidor', lida: false },
  { id: 4, user: 'Pedro Oliveira', iniciais: 'PO', acao: 'começou a seguir você', alvo: 'Interestelar', tempo: '3 horas atrás', tipo: 'seguidor', lida: true },
  { id: 5, user: 'Carla Mendes', iniciais: 'CM', acao: 'comentou em', alvo: 'Melhores Críticos', tempo: '5 horas atrás', tipo: 'comentario', lida: true },
];

function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState(INITIAL_DATA);
  const [filtro, setFiltro] = useState('Todas');

  // Apagar todas notificações
  const handleDeleteAll = () => {
    setNotificacoes([]);
  };

  // Marcar todas como lidas
  const handleMarkAllAsRead = () => {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
  };

  // Apagar apenas uma notificação
  const handleDelete = (id) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  };

  // Alternar status de lida/não lida
  const handleToggleReadStatus = (id) => {
    setNotificacoes(prev => prev.map(n => 
      n.id === id ? { ...n, lida: !n.lida } : n
    ));
  };

  // modelo de filtragem
  const notificacoesExibidas = notificacoes.filter(n => {
    if (filtro === 'Todas') return true;
    if (filtro === 'Não Lidas') return !n.lida;
    if (filtro === 'Curtidas') return n.tipo === 'curtida';
    if (filtro === 'Comentários') return n.tipo === 'comentario';
    if (filtro === 'Seguidores') return n.tipo === 'seguidor';
    return true;
  });

  // Contador dinâmico baseado na lista total de notififcações
  const naoLidasCount = notificacoes.filter(n => !n.lida).length;

  const renderIcon = (tipo) => {
    switch (tipo) {
      case 'curtida': return '♡'; 
      case 'comentario': return '💬'; 
      case 'seguidor': return '👤'; 
      default: return '●';
    }
  };

  return (
    <div className="onboarding-container">
      <HeaderLogado />
      
      <main className="notificacoes-main">
        <header className="notificacoes-top-bar">
          <div className="title-section">
            <span className="bell-outline">🔔</span>
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

        {/* NAVEGAÇÃO DE FILTROS */}
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

        {/* LISTA RENDERIZANDO A VARIÁVEL FILTRADA */}
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
                  {/* Botão de Toggle: Muda o ícone conforme o estado */}
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