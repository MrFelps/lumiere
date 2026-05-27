import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import { getPopularMovies, discoverMoviesByGenre } from '../../services/tmdb';
import './style.css';

const TODOS_GENEROS = ["Todos", "Ação", "Comédia", "Drama", "Ficção Científica", "Terror", "Romance", "Animação", "Documentário"];

// Mood-to-genre helper mapping
const MOOD_TO_GENRE = {
  "Para Relaxar": "Comédia",
  "Tensão Pura": "Terror",
  "Rir até doer": "Comédia",
  "Chorar rios": "Drama"
};

function Filmes() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verifica se veio alguma categoria clicada lá da tela de Descobrir
  const categoriaDaRota = location.state?.categoriaInicial || "Todos";

  const [categoriaAtiva, setCategoriaAtiva] = useState(categoriaDaRota);
  const [filmesExibidos, setFilmesExibidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Se a rota mudar (usuário clicou em outro card lá no Descobrir), atualizamos o estado
  useEffect(() => {
    if (location.state?.categoriaInicial) {
      setCategoriaAtiva(location.state.categoriaInicial);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let genreToFetch = categoriaAtiva;
        
        // Map moods to concrete genres
        if (MOOD_TO_GENRE[categoriaAtiva]) {
          genreToFetch = MOOD_TO_GENRE[categoriaAtiva];
        }

        let data = [];
        if (genreToFetch === "Todos") {
          data = await getPopularMovies();
        } else {
          data = await discoverMoviesByGenre(genreToFetch);
        }

        setFilmesExibidos(data);
      } catch (error) {
        console.error("Erro ao carregar catálogo de filmes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [categoriaAtiva]);

  return (
    <div className="filmes-container">
      <HeaderLogado />
      
      <main className="filmes-main">
        <header className="filmes-header">
          <h1 className="filmes-title">Catálogo de Filmes</h1>
          <p className="filmes-subtitle">
            {categoriaAtiva === "Todos" 
              ? "Navegue por todos os filmes populares disponíveis na Lumière." 
              : `Explorando a categoria: ${categoriaAtiva}`}
          </p>
        </header>

        <div className="filmes-pill-filters">
          {TODOS_GENEROS.map(gen => (
            <button 
              key={gen} 
              className={`pill-btn ${categoriaAtiva === gen ? 'active' : ''}`}
              onClick={() => setCategoriaAtiva(gen)}
            >
              {gen}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ color: '#fff', textAlign: 'center', padding: '60px 0' }}>
            <h2 style={{ fontFamily: 'Inter, sans-serif' }}>Abrindo as cortinas da categoria... 🎭</h2>
          </div>
        ) : (
          <div className="filmes-grid">
            {filmesExibidos.length > 0 ? (
              filmesExibidos.map(movie => (
                <div key={movie.id} className="filmes-card" onClick={() => navigate(`/filme/${movie.id}`)}>
                  <div className="filmes-poster">
                    <img src={movie.img} alt={movie.title} />
                    <div className="filmes-rating">⭐ {movie.rating}</div>
                  </div>
                  <h4 className="filmes-card-title">{movie.title}</h4>
                  <div className="filmes-card-meta">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.genre}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="filmes-empty-state">
                <h2>Nenhum filme encontrado 🎬</h2>
                <p>Não encontramos filmes para a categoria "{categoriaAtiva}" no momento.</p>
                <button className="btn-voltar-todos" onClick={() => setCategoriaAtiva("Todos")}>Ver Todos os Filmes</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Filmes;