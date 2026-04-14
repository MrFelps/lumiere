import React, { useState } from 'react';
import HeaderLogado from '../../Components/HeaderLogado';
import './style.css';

// MOCK DATA
const USER_DATA = {
  nome: "João da Silva",
  iniciais: "JD",
  bio: "Cinéfilo apaixonado por histórias que nos transformam.",
  membroDesde: "Janeiro 2023",
  estatisticasGlobais: { 
    seguidores: 124, 
    seguindo: 88, 
    avaliacoes: 8, 
    listas: 15,
    filmesAssistidos: 342},
  estatisticasMensais: { horasAssistidas: 324, mediaAvaliacao: "4.4", filmesEsteMes: 12 },
  generosFavoritos: [
    { nome: "Ficção Científica", porcentagem: 45 },
    { nome: "Drama", porcentagem: 30 },
    { nome: "Ação", porcentagem: 25 }
  ],
  // Imagens simulando TMDB
  assistidosRecentemente: [
    { id: 101, titulo: "Oppenheimer", capa: "https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg?w=300" },
    { id: 102, titulo: "Interestelar", capa: "https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?w=300" },
    { id: 103, titulo: "Duna", capa: "https://images.pexels.com/photos/5435307/pexels-photo-5435307.jpeg?w=300" }
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
  const [banner, setBanner] = useState('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200');
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBanner(imageUrl);
    }
  };

  return (
    <div className="perfil-container">
      <HeaderLogado />
      
      <section className="perfil-banner" style={{ backgroundImage: `url(${banner})` }}>
        <div className="banner-overlay"></div>
      
        <input 
          type="file" 
          id="banner-upload" 
          accept="image/*" 
          onChange={handleBannerUpload} 
          style={{ display: 'none' }} 
        />
        <label htmlFor="banner-upload" className="btn-mudar-capa">
          📷 Alterar Capa
        </label>
      </section>

      <main className="perfil-main">
        <div className="perfil-header-row">
          <div className="user-info-section">
            <div className="user-avatar-large">{USER_DATA.iniciais}</div>
            <div className="user-details">
              <h1>{USER_DATA.nome}</h1>
              <p className="user-bio">{USER_DATA.bio}</p>
              <div className="user-meta">
                <span>🗓️ Membro desde {USER_DATA.membroDesde}</span>
              </div>
              
              <div className="user-actions">
                <button className="btn-primary-small" onClick={() => alert("Editar")}>Editar Perfil</button>
                <button className="btn-outline-small" onClick={() => alert("Config")}>⚙️ Configurações</button>
              </div>

            </div>
          </div>

          <div className="global-stats-section">
            <div className="stat-box">
             <span className="stat-icon">🎬</span>
            <div className="stat-info">
                <h3>{USER_DATA.estatisticasGlobais.filmesAssistidos}</h3>
                <p>Assistidos</p>
            </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">👥</span>
            <div className="stat-info">
                <h3>{USER_DATA.estatisticasGlobais.seguidores}</h3>
                <p>Seguidores</p>
            </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">👤</span>
              <div className="stat-info">
                <h3>{USER_DATA.estatisticasGlobais.seguindo}</h3>
                <p>Seguindo</p>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">⭐</span>
              <div className="stat-info">
                <h3>{USER_DATA.estatisticasGlobais.avaliacoes}</h3>
                <p>Avaliações</p>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">≣</span>
              <div className="stat-info">
                <h3>{USER_DATA.estatisticasGlobais.listas}</h3>
                <p>Listas Criadas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="perfil-complex-grid">
          <div className="grid-col-left">
            
            <section className="profile-section">
              <h2 className="section-title">Atividade Recente</h2>
              <div className="activity-list">
                {USER_DATA.atividadeRecente.map(ativ => (
                  <div key={ativ.id} className="activity-card">
                    <div className="activity-icon">{ativ.acao === 'Avaliador' ? '⭐' : '👁️'}</div>
                    <div className="activity-details">
                      <p><strong>{USER_DATA.nome}</strong> {ativ.acao === 'Avaliador' ? 'avaliou' : 'assistiu'} <span className="highlight-text">{ativ.filme}</span></p>
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
                <div className="poster-card" style={{ width: '100px', height: '150px' }}>
                  <img src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300" alt="Favorito 1" />
                </div>
                <div className="poster-card" style={{ width: '100px', height: '150px' }}>
                  <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300" alt="Favorito 2" />
                </div>
                <div className="poster-card" style={{ width: '100px', height: '150px' }}>
                  <img src="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300" alt="Favorito 3" />
                </div>
              </div>
            </section>
          </div>

          <div className="grid-col-right">
            
            <section className="profile-section">
              <h2 className="section-title">Minhas Listas</h2>
              <div className="mini-lists">
                {USER_DATA.listas.map(lista => (
                  <div key={lista.id} className="mini-list-card">
                    <div className="mini-list-icon">≣</div>
                    <div className="mini-list-info">
                      <h4>{lista.nome}</h4>
                      <p>{lista.qtd} filmes</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="profile-section">
              <h2 className="section-title">Gêneros Favoritos</h2>
              <div className="genres-list">
                {USER_DATA.generosFavoritos.map((genero, index) => (
                  <div key={index} className="genre-item">
                    <div className="genre-header">
                      <span>{genero.nome}</span>
                      <span>{genero.porcentagem}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${genero.porcentagem}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="profile-section">
              <h2 className="section-title">Estatísticas</h2>
              <ul className="stats-list-vertical">
                <li>
                  <span>Horas Assistidas</span>
                  <strong>{USER_DATA.estatisticasMensais.horasAssistidas}h</strong>
                </li>
                <li>
                  <span>Média de Avaliação</span>
                  <strong>{USER_DATA.estatisticasMensais.mediaAvaliacao} ⭐</strong>
                </li>
                <li>
                  <span>Filmes Este Mês</span>
                  <strong>{USER_DATA.estatisticasMensais.filmesEsteMes}</strong>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Perfil;