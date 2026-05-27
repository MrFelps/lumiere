import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import { getPopularMovies, getTopRatedMovies } from '../../services/tmdb';
import api from '../../services/api';
import './style.css';

// Backup Mock Data in case of offline/loading
const BACKUP_FEATURED = {
  id: 3,
  title: "Além das Estrelas",
  synopsis: "Uma jornada épica através das galáxias em busca de um novo lar para a humanidade. Ambientado em 2240, a tripulação da nave Prometheus descobre um sinal que pode mudar o destino de toda a raça humana.",
  backdrop: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=1600",
  rating: 8.8,
  genres: ["Ficção Científica", "Aventura"]
};

function Home() {
  const navigate = useNavigate();
  
  const [featuredMovie, setFeaturedMovie] = useState(BACKUP_FEATURED);
  const [populares, setPopulares] = useState([]);
  const [recentes, setRecentes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

  const handleOpenListModal = async () => {
    setIsListModalOpen(true);
    setLoadingLists(true);
    try {
      const res = await api.get('/feed/listas');
      setUserLists(res.data);
    } catch (e) {
      console.error("Erro ao carregar listas na Home:", e);
    } finally {
      setLoadingLists(false);
    }
  };

  const handleAddMovieToList = async (listId) => {
    try {
      await api.post('/feed/listas/adicionar', {
        list_id: listId,
        movie_id: featuredMovie.id,
        movie_title: featuredMovie.title,
        movie_poster: featuredMovie.img
      });
      alert(`Filme adicionado à lista com sucesso!`);
      setIsListModalOpen(false);
    } catch (e) {
      console.error("Erro ao adicionar filme à lista:", e);
      alert("Erro ao adicionar o filme à lista.");
    }
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const popular = await getPopularMovies();
        const topRated = await getTopRatedMovies();

        if (popular && popular.length > 0) {
          // Use first popular movie as the featured hero movie
          setFeaturedMovie(popular[0]);
          // Use subsequent popular movies for the popular carousel
          setPopulares(popular.slice(1, 10));
        }

        if (topRated && topRated.length > 0) {
          setRecentes(topRated.slice(0, 10));
        }
      } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-container">
      <HeaderLogado />
      
      {loading ? (
        <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Carregando a magia do cinema... ✨</h2>
        </div>
      ) : (
        <>
          <section 
            className="home-hero" 
            style={{ backgroundImage: `url(${featuredMovie.backdrop})` }}
          >
            <div className="home-hero-overlay"></div>
            <div className="home-hero-content">
              <div className="featured-tags">
                {featuredMovie.genres && featuredMovie.genres.map(g => <span key={g} className="featured-tag">{g}</span>)}
                <span className="featured-rating">⭐ {featuredMovie.rating}</span>
              </div>
              <h1 className="featured-title">{featuredMovie.title}</h1>
              <p className="featured-synopsis">{featuredMovie.synopsis}</p>
              
              <div className="featured-actions">
                <button className="btn-featured-primary" onClick={() => navigate(`/filme/${featuredMovie.id}`)}>
                  ▶ Detalhes
                </button>
                <button className="btn-featured-outline" onClick={handleOpenListModal}>
                  ➕ Minha Lista
                </button>
              </div>
            </div>
          </section>

          <main className="home-main-content">
            
            <section className="movie-row-section">
              <div className="row-header">
                <h2 className="row-title">Populares no Lumière</h2>
                <button className="row-see-all" onClick={() => navigate('/em-alta')}>Ver todos</button>
              </div>
              
              <div className="movie-carousel">
                {populares.map(movie => (
                  <div key={movie.id} className="home-movie-card" onClick={() => navigate(`/filme/${movie.id}`)}>
                    <div className="home-movie-poster">
                      <img src={movie.img} alt={movie.title} />
                      <div className="poster-rating">⭐ {movie.rating}</div>
                    </div>
                    <h4 className="home-movie-title">{movie.title}</h4>
                    <span className="home-movie-year">{movie.year}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="movie-row-section">
              <div className="row-header">
                <h2 className="row-title">Mais Votados (Destaques)</h2>
                <button className="row-see-all" onClick={() => navigate('/filmes')}>Ver todos</button>
              </div>
              
              <div className="movie-carousel">
                {recentes.map(movie => (
                  <div key={movie.id} className="home-movie-card" onClick={() => navigate(`/filme/${movie.id}`)}>
                    <div className="home-movie-poster">
                      <img src={movie.img} alt={movie.title} />
                      <div className="poster-rating">⭐ {movie.rating}</div>
                    </div>
                    <h4 className="home-movie-title">{movie.title}</h4>
                    <span className="home-movie-year">{movie.year}</span>
                  </div>
                ))}
              </div>
            </section>

          </main>
        </>
      )}

      {isListModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>🎬 Adicionar à Lista</h2>
              <button className="close-modal-btn" onClick={() => setIsListModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: '15px 0' }}>
              {loadingLists ? (
                <p style={{ color: '#888', textAlign: 'center' }}>Carregando suas listas...</p>
              ) : userLists.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {userLists.map(lista => (
                    <button 
                      key={lista.id} 
                      onClick={() => handleAddMovieToList(lista.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        background: '#111',
                        border: '1px solid rgba(255,255,255,0.05)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        color: '#fff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = '#a86b32';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#111';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      }}
                    >
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem' }}>{lista.nome}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>{lista.description || 'Sem descrição'}</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#a86b32' }}>➕</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                  <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '15px' }}>Você ainda não criou nenhuma lista.</p>
                  <button 
                    className="btn-primary-small"
                    onClick={() => {
                      setIsListModalOpen(false);
                      navigate('/perfil');
                    }}
                  >
                    Ir para o Perfil Criar Lista
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-outline-small" onClick={() => setIsListModalOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;