import React, { useState } from 'react';
import HeaderLogado from '../../Components/HeaderLogado';
import './style.css';

const dataDoBancoDeDados = "2023-01-15T14:30:00Z";

const formatarDataCadastro = (isoString) => {
  const data = new Date(isoString);
  const mes = data.toLocaleString('pt-BR', { month: 'long' });
  const ano = data.getFullYear();
  return `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${ano}`;
};

const INITIAL_USER_DATA = {
  nome: "João da Silva",
  iniciais: "JD",
  bio: "Cinéfilo apaixonado por histórias que nos transformam.",
  membroDesde: formatarDataCadastro(dataDoBancoDeDados), 
  idioma: "Português (BR)", 
  estatisticasGlobais: { seguidores: 124, seguindo: 88, avaliacoes: 8, listas: 15, filmesAssistidos: 342 },
  estatisticasMensais: { horasAssistidas: 324, mediaAvaliacao: "4.4", filmesEsteMes: 12 },
  generosFavoritos: [
    { nome: "Ficção Científica", porcentagem: 45 },
    { nome: "Drama", porcentagem: 30 },
    { nome: "Ação", porcentagem: 25 }
  ],
  atividadeRecente: [
    { id: 1, acao: "Avaliador", filme: "A Viagem de Chihiro", estrelas: 5, data: "2 dias atrás" },
    { id: 2, acao: "Assistiu", filme: "Parasita", estrelas: null, data: "5 dias atrás" }
  ],
  listas: [
    { id: 1, nome: "Clássicos Imperdíveis", qtd: 15 },
    { id: 2, nome: "Para Chorar", qtd: 8 }
  ]
};

function Perfil() {
  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  const [banner, setBanner] = useState('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({ nome: '', iniciais: '', bio: '' });
  const [settingsForm, setSettingsForm] = useState({ idioma: '' });

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) setBanner(URL.createObjectURL(file));
  };

  const openEditModal = () => {
    setEditForm({ nome: userData.nome, iniciais: userData.iniciais, bio: userData.bio });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setUserData(prev => ({ ...prev, nome: editForm.nome, iniciais: editForm.iniciais, bio: editForm.bio }));
    setIsEditModalOpen(false);
  };

  const openSettingsModal = () => {
    setSettingsForm({ idioma: userData.idioma });
    setIsSettingsModalOpen(true);
  };

  const handleSaveSettings = () => {
    setUserData(prev => ({ ...prev, idioma: settingsForm.idioma }));
    setIsSettingsModalOpen(false);
  };

  return (
    <div className="perfil-container">
      <HeaderLogado />
      <section className="perfil-banner" style={{ backgroundImage: `url(${banner})` }}>
        <div className="banner-overlay"></div>
        <input type="file" id="banner-upload" accept="image/*" onChange={handleBannerUpload} style={{ display: 'none' }} />
        <label htmlFor="banner-upload" className="btn-mudar-capa">📷 Alterar Capa</label>
      </section>

      <main className="perfil-main">
        <div className="perfil-header-row">
          <div className="user-info-section">
            <div className="user-avatar-large">{userData.iniciais}</div>
            <div className="user-details">
              <h1>{userData.nome}</h1>
              <p className="user-bio">{userData.bio}</p>
              <div className="user-meta">
                <span>🗓️ Membro desde {userData.membroDesde}</span>
                <span style={{ marginLeft: '15px' }}>🌐 Idioma: {userData.idioma}</span>
              </div>
              <div className="user-actions">
                <button className="btn-primary-small" onClick={openEditModal}>Editar Perfil</button>
                <button className="btn-outline-small" onClick={openSettingsModal}>⚙️ Configurações</button>
              </div>
            </div>
          </div>
          <div className="global-stats-section">
            <div className="stat-box"><span className="stat-icon">🎬</span><div className="stat-info"><h3>{userData.estatisticasGlobais.filmesAssistidos}</h3><p>Assistidos</p></div></div>
            <div className="stat-box"><span className="stat-icon">👥</span><div className="stat-info"><h3>{userData.estatisticasGlobais.seguidores}</h3><p>Seguidores</p></div></div>
            <div className="stat-box"><span className="stat-icon">👤</span><div className="stat-info"><h3>{userData.estatisticasGlobais.seguindo}</h3><p>Seguindo</p></div></div>
            <div className="stat-box"><span className="stat-icon">⭐</span><div className="stat-info"><h3>{userData.estatisticasGlobais.avaliacoes}</h3><p>Avaliações</p></div></div>
            <div className="stat-box"><span className="stat-icon">≣</span><div className="stat-info"><h3>{userData.estatisticasGlobais.listas}</h3><p>Listas Criadas</p></div></div>
          </div>
        </div>

        <div className="perfil-complex-grid">
          <div className="grid-col-left">
            <section className="profile-section">
              <h2 className="section-title">Atividade Recente</h2>
              <div className="activity-list">
                {userData.atividadeRecente.map(ativ => (
                  <div key={ativ.id} className="activity-card">
                    <div className="activity-icon">{ativ.acao === 'Avaliador' ? '⭐' : '👁️'}</div>
                    <div className="activity-details">
                      <p><strong>{userData.nome}</strong> {ativ.acao === 'Avaliador' ? 'avaliou' : 'assistiu'} <span className="highlight-text">{ativ.filme}</span></p>
                      {ativ.estrelas && <span className="stars">{'★'.repeat(ativ.estrelas)}</span>}
                      <span className="activity-time">{ativ.data}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="profile-section">
              <h2 className="section-title">Assistidos Recentemente</h2>
              <div className="posters-carousel" style={{ paddingBottom: '0' }}>
                <div className="poster-card" style={{ width: '100px', height: '150px' }}><img src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300" alt="Post" /></div>
                <div className="poster-card" style={{ width: '100px', height: '150px' }}><img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300" alt="Post" /></div>
                <div className="poster-card" style={{ width: '100px', height: '150px' }}><img src="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300" alt="Post" /></div>
              </div>
            </section>
          </div>
          <div className="grid-col-right">
            <section className="profile-section">
              <h2 className="section-title">Minhas Listas</h2>
              <div className="mini-lists">
                {userData.listas.map(lista => (
                  <div key={lista.id} className="mini-list-card"><div className="mini-list-icon">≣</div><div className="mini-list-info"><h4>{lista.nome}</h4><p>{lista.qtd} filmes</p></div></div>
                ))}
              </div>
            </section>
            <section className="profile-section">
              <h2 className="section-title">Gêneros Favoritos</h2>
              <div className="genres-list">
                {userData.generosFavoritos.map((genero, index) => (
                  <div key={index} className="genre-item">
                    <div className="genre-header"><span>{genero.nome}</span><span>{genero.porcentagem}%</span></div>
                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${genero.porcentagem}%` }}></div></div>
                  </div>
                ))}
              </div>
            </section>
            <section className="profile-section">
              <h2 className="section-title">Estatísticas</h2>
              <ul className="stats-list-vertical">
                <li><span>Horas Assistidas</span><strong>{userData.estatisticasMensais.horasAssistidas}h</strong></li>
                <li><span>Média de Avaliação</span><strong>{userData.estatisticasMensais.mediaAvaliacao} ⭐</strong></li>
                <li><span>Filmes Este Mês</span><strong>{userData.estatisticasMensais.filmesEsteMes}</strong></li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Editar Perfil</h2>
              <button className="close-modal-btn" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label>Nome de Exibição</label>
                <input type="text" value={editForm.nome} onChange={(e) => setEditForm({...editForm, nome: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Iniciais do Avatar (Máx 2 letras)</label>
                <input type="text" maxLength="2" value={editForm.iniciais} onChange={(e) => setEditForm({...editForm, iniciais: e.target.value.toUpperCase()})} />
              </div>
              <div className="input-group">
                <label>Bio</label>
                <textarea rows="3" value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline-small" onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
              <button className="btn-primary-small" onClick={handleSaveEdit}>Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {isSettingsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>⚙️ Configurações</h2>
              <button className="close-modal-btn" onClick={() => setIsSettingsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label>Idioma do Aplicativo</label>
                <select value={settingsForm.idioma} onChange={(e) => setSettingsForm({...settingsForm, idioma: e.target.value})}>
                  <option value="Português (BR)">Português (BR)</option>
                  <option value="English (US)">English (US)</option>
                  <option value="Español (ES)">Español (ES)</option>
                </select>
              </div>
              <p className="settings-hint">Mais opções de configuração (Tema, Notificações) serão adicionadas no futuro.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-outline-small" onClick={() => setIsSettingsModalOpen(false)}>Cancelar</button>
              <button className="btn-primary-small" onClick={handleSaveSettings}>Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;