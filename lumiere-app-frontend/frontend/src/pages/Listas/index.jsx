import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import { getTopRatedMovies, discoverMoviesByGenre, getPopularMovies } from '../../services/tmdb';
import './style.css';

// 1. DADOS DO USUÁRIO LOGADO (Para quando ele criar uma lista)
const LOGGED_USER = { name: "João da Silva", initials: "JD" };

// 2. BACKUP MOCK DATA INICIAL
const BACKUP_LISTAS = [
  { 
    id: 1, title: "Clássicos Imperdíveis", creator: "João da Silva", initials: "JD", movieCount: 15, likes: 342,
    covers: [
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300",
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300",
      "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300"
    ]
  },
  { 
    id: 2, title: "Ficção Científica Cabeça", creator: "Maria Silva", initials: "MS", movieCount: 8, likes: 890,
    covers: [
      "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=300",
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300",
      "https://images.unsplash.com/photo-1499806548232-a5676dbbf92e?w=300"
    ]
  },
  { 
    id: 3, title: "Noites de Terror", creator: "Lucas Santos", initials: "LS", movieCount: 24, likes: 125,
    covers: [
      "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=300",
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300",
      "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=300"
    ]
  }
];

function Listas() {
  const navigate = useNavigate();
  
  const [listas, setListas] = useState(BACKUP_LISTAS);
  const [abaAtiva, setAbaAtiva] = useState('Comunidade');
  const [loading, setLoading] = useState(true);
  
  // Estados do Modal de Nova Lista
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaListaTitle, setNovaListaTitle] = useState('');

  useEffect(() => {
    const fetchCoversForLists = async () => {
      setLoading(true);
      try {
        const classicos = await getTopRatedMovies();
        const scifi = await discoverMoviesByGenre("Ficção Científica");
        const terror = await discoverMoviesByGenre("Terror");

        const updatedListas = [
          {
            id: 1, 
            title: "Clássicos Imperdíveis", 
            creator: "João da Silva", 
            initials: "JD", 
            movieCount: classicos.length > 0 ? Math.min(classicos.length, 12) : 12, 
            likes: 342,
            covers: classicos.length >= 3 
              ? [classicos[0].img, classicos[1].img, classicos[2].img] 
              : BACKUP_LISTAS[0].covers
          },
          {
            id: 2, 
            title: "Ficção Científica Cabeça", 
            creator: "Maria Silva", 
            initials: "MS", 
            movieCount: scifi.length > 0 ? Math.min(scifi.length, 12) : 12, 
            likes: 890,
            covers: scifi.length >= 3 
              ? [scifi[0].img, scifi[1].img, scifi[2].img] 
              : BACKUP_LISTAS[1].covers
          },
          {
            id: 3, 
            title: "Noites de Terror", 
            creator: "Lucas Santos", 
            initials: "LS", 
            movieCount: terror.length > 0 ? Math.min(terror.length, 12) : 12, 
            likes: 125,
            covers: terror.length >= 3 
              ? [terror[0].img, terror[1].img, terror[2].img] 
              : BACKUP_LISTAS[2].covers
          }
        ];

        setListas(updatedListas);
      } catch (error) {
        console.error("Erro ao popular capas das listas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoversForLists();
  }, []);

  const listasExibidas = abaAtiva === 'Minhas Listas' 
    ? listas.filter(lista => lista.creator === LOGGED_USER.name) 
    : listas;

  const handleCreateList = async () => {
    if (novaListaTitle.trim() === '') {
      alert("Dê um nome para a sua lista!");
      return;
    }

    let defaultCovers = BACKUP_LISTAS[0].covers;
    try {
      const popular = await getPopularMovies();
      if (popular && popular.length >= 3) {
        defaultCovers = [popular[0].img, popular[1].img, popular[2].img];
      }
    } catch (e) {
      console.error(e);
    }

    const novaLista = {
      id: Date.now(),
      title: novaListaTitle,
      creator: LOGGED_USER.name,
      initials: LOGGED_USER.initials,
      movieCount: 0,
      likes: 0,
      covers: defaultCovers
    };

    setListas([novaLista, ...listas]);
    
    setNovaListaTitle('');
    setIsModalOpen(false);
    setAbaAtiva('Minhas Listas');
  };

  return (
    <div className="listas-container">
      <HeaderLogado />
      
      <main className="listas-main">
        <header className="listas-header">
          <div className="header-title-wrapper">
            <span className="list-icon">≣</span>
            <div>
              <h1 className="listas-title">Listas de Filmes</h1>
              <p className="listas-subtitle">Coleções criadas por você e pela comunidade Lumière.</p>
            </div>
          </div>

          <div className="list-actions-header">
            <div className="period-toggle">
              <button 
                className={`toggle-btn ${abaAtiva === 'Comunidade' ? 'active' : ''}`}
                onClick={() => setAbaAtiva('Comunidade')}
              >
                Explorar
              </button>
              <button 
                className={`toggle-btn ${abaAtiva === 'Minhas Listas' ? 'active' : ''}`}
                onClick={() => setAbaAtiva('Minhas Listas')}
              >
                Minhas Listas
              </button>
            </div>
            
            <button className="btn-create-list" onClick={() => setIsModalOpen(true)}>
              ➕ Nova Lista
            </button>
          </div>
        </header>

        {loading ? (
          <div style={{ color: '#fff', textAlign: 'center', padding: '60px 0' }}>
            <h2 style={{ fontFamily: 'Inter, sans-serif' }}>Carregando as prateleiras de coleções... 📚</h2>
          </div>
        ) : (
          <div className="listas-grid">
            {listasExibidas.length > 0 ? (
              listasExibidas.map(lista => (
                <div key={lista.id} className="lista-card" onClick={() => navigate(`/lista/${lista.id}`)}>
                  
                  <div className="lista-covers-stack">
                    {lista.covers.map((imgUrl, index) => (
                      <img key={index} src={imgUrl} alt={`Capa ${index}`} className={`stacked-cover cover-${index + 1}`} />
                    ))}
                    <div className="lista-count-overlay">
                      <span>{lista.movieCount}</span>
                      <span className="small-text">filmes</span>
                    </div>
                  </div>

                  <div className="lista-info">
                    <h3 className="lista-card-title">{lista.title}</h3>
                    <div className="lista-creator-meta">
                      <div className="creator-avatar-small">{lista.initials}</div>
                      <span className="creator-name">{lista.creator}</span>
                    </div>
                    <div className="lista-stats">
                      <span>❤️ {lista.likes} curtidas</span>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="listas-empty-state">
                <h2>Você ainda não tem listas 📝</h2>
                <p>Crie sua primeira lista para organizar seus filmes favoritos.</p>
                <button className="btn-create-list-large" onClick={() => setIsModalOpen(true)}>Criar Minha Primeira Lista</button>
              </div>
            )}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="lista-modal-overlay">
          <div className="lista-modal-content">
            <div className="lista-modal-header">
              <h2>Criar Nova Lista</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="lista-modal-body">
              <div className="lista-input-group">
                <label>Nome da Lista</label>
                <input 
                  type="text" 
                  placeholder="Ex: Filmes para assistir no Halloween..."
                  value={novaListaTitle} 
                  onChange={(e) => setNovaListaTitle(e.target.value)} 
                  autoFocus
                />
              </div>
              <p className="lista-modal-hint">Você poderá adicionar filmes a esta lista diretamente pelas páginas de Detalhes dos Filmes.</p>
            </div>
            <div className="lista-modal-footer">
              <button className="btn-cancel-lista" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="btn-save-lista" onClick={handleCreateList}>Criar Lista</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Listas;