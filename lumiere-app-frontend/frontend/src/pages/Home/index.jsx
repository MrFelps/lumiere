import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import { getPopularMovies, getTopRatedMovies } from '../../services/tmdb';
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
                <button className="btn-featured-outline">
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
    </div>
  );
}

export default Home;