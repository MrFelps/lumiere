import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import { getTrendingMovies } from '../../services/tmdb';
import './style.css';

function EmAlta() {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState('Hoje');
  const [filmesExibidos, setFilmesExibidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const data = await getTrendingMovies(periodo === 'Hoje' ? 'day' : 'week');
        setFilmesExibidos(data.slice(0, 10)); // Top 10 trending
      } catch (error) {
        console.error("Erro ao buscar filmes em alta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [periodo]);

  return (
    <div className="em-alta-container">
      <HeaderLogado />
      
      <main className="em-alta-main">
        <header className="em-alta-header">
          <div className="header-title-wrapper">
            <span className="fire-icon">🔥</span>
            <div>
              <h1 className="em-alta-title">Em Alta</h1>
              <p className="em-alta-subtitle">Os filmes mais assistidos e comentados do momento no TMDB.</p>
            </div>
          </div>

          <div className="period-toggle">
            <button 
              className={`toggle-btn ${periodo === 'Hoje' ? 'active' : ''}`}
              onClick={() => setPeriodo('Hoje')}
            >
              Hoje
            </button>
            <button 
              className={`toggle-btn ${periodo === 'Semana' ? 'active' : ''}`}
              onClick={() => setPeriodo('Semana')}
            >
              Esta Semana
            </button>
          </div>
        </header>

        {loading ? (
          <div style={{ color: '#fff', textAlign: 'center', padding: '60px 0' }}>
            <h2 style={{ fontFamily: 'Inter, sans-serif' }}>Aquecendo os projetores... 🔥</h2>
          </div>
        ) : (
          <div className="em-alta-grid">
            {filmesExibidos.map((movie, index) => (
              <div key={movie.id} className="em-alta-card" onClick={() => navigate(`/filme/${movie.id}`)}>
                <div className="em-alta-poster">
                  <img src={movie.img} alt={movie.title} />
                  <div className={`rank-badge rank-${index + 1}`}>
                    #{index + 1}
                  </div>
                  <div className="em-alta-rating">⭐ {movie.rating}</div>
                </div>
                <div className="em-alta-info">
                  <h4 className="em-alta-card-title">{movie.title}</h4>
                  <div className="em-alta-card-meta">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.genre}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default EmAlta;