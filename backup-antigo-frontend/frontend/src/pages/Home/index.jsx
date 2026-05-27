import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import './style.css';

// ==========================================
// MOCK DATA (Simulando o que a equipe da API vai te enviar depois)
// ==========================================
const FEATURED_MOVIE = {
  id: 3,
  title: "Além das Estrelas",
  synopsis: "Uma jornada épica através das galáxias em busca de um novo lar para a humanidade. Ambientado em 2240, a tripulação da nave Prometheus descobre um sinal que pode mudar o destino de toda a raça humana.",
  backdrop: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=1600",
  rating: 8.8,
  genres: ["Ficção Científica", "Aventura"]
};

const MOCK_CAROUSEL_POPULARES = [
  { id: 1, title: "Cidade Sombria", year: "2024", rating: 8.5, img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400" },
  { id: 2, title: "Noite Eterna", year: "2023", rating: 7.2, img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400" },
  { id: 4, title: "Corações em Conflito", year: "2024", rating: 6.5, img: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400" },
  { id: 7, title: "Montanhas da Aventura", year: "2024", rating: 8.0, img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400" },
  { id: 8, title: "Reino dos Sonhos", year: "2025", rating: 8.8, img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400" }
];

const MOCK_CAROUSEL_RECENTES = [
  { id: 5, title: "A Casa Silenciosa", year: "2024", rating: 5.8, img: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400" },
  { id: 6, title: "Risadas no Tempo", year: "2025", rating: 7.8, img: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400" },
  { id: 1, title: "Cidade Sombria", year: "2024", rating: 8.5, img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400" },
  { id: 2, title: "Noite Eterna", year: "2023", rating: 7.2, img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400" },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <HeaderLogado />
      <section 
        className="home-hero" 
        style={{ backgroundImage: `url(${FEATURED_MOVIE.backdrop})` }}
      >
        <div className="home-hero-overlay"></div>
        <div className="home-hero-content">
          <div className="featured-tags">
            {FEATURED_MOVIE.genres.map(g => <span key={g} className="featured-tag">{g}</span>)}
            <span className="featured-rating">⭐ {FEATURED_MOVIE.rating}</span>
          </div>
          <h1 className="featured-title">{FEATURED_MOVIE.title}</h1>
          <p className="featured-synopsis">{FEATURED_MOVIE.synopsis}</p>
          
          <div className="featured-actions">
            <button className="btn-featured-primary" onClick={() => navigate(`/filme/${FEATURED_MOVIE.id}`)}>
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
            {MOCK_CAROUSEL_POPULARES.map(movie => (
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
            <h2 className="row-title">Adicionados Recentemente</h2>
            <button className="row-see-all" onClick={() => navigate('/filmes')}>Ver todos</button>
          </div>
          
          <div className="movie-carousel">
            {MOCK_CAROUSEL_RECENTES.map(movie => (
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
    </div>
  );
}

export default Home;