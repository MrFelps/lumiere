import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import './style.css';

// ==========================================
// MOCK DATA (Simulando o endpoint /trending da API)
// ==========================================
const MOCK_TRENDING_HOJE = [
  { id: 3, title: "Além das Estrelas", year: "2025", genre: "Ficção Científica", rating: 9.1, img: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400" },
  { id: 1, title: "Cidade Sombria", year: "2024", genre: "Ação", rating: 8.5, img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400" },
  { id: 8, title: "Reino dos Sonhos", year: "2025", genre: "Ficção Científica", rating: 8.8, img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400" },
  { id: 6, title: "Risadas no Tempo", year: "2025", genre: "Comédia", rating: 7.8, img: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400" },
  { id: 7, title: "Montanhas da Aventura", year: "2024", genre: "Ação", rating: 8.0, img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400" }
];

const MOCK_TRENDING_SEMANA = [
  { id: 2, title: "Noite Eterna", year: "2023", genre: "Drama", rating: 7.2, img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400" },
  { id: 1, title: "Cidade Sombria", year: "2024", genre: "Ação", rating: 8.5, img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400" },
  { id: 4, title: "Corações em Conflito", year: "2024", genre: "Romance", rating: 6.5, img: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400" },
  { id: 5, title: "A Casa Silenciosa", year: "2024", genre: "Terror", rating: 5.8, img: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400" },
  { id: 3, title: "Além das Estrelas", year: "2025", genre: "Ficção Científica", rating: 9.1, img: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400" }
];

function EmAlta() {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState('Hoje');

  const filmesExibidos = periodo === 'Hoje' ? MOCK_TRENDING_HOJE : MOCK_TRENDING_SEMANA;

  return (
    <div className="em-alta-container">
      <HeaderLogado />
      
      <main className="em-alta-main">
        <header className="em-alta-header">
          <div className="header-title-wrapper">
            <span className="fire-icon">🔥</span>
            <div>
              <h1 className="em-alta-title">Em Alta</h1>
              <p className="em-alta-subtitle">Os filmes mais assistidos e comentados do momento.</p>
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
      </main>
    </div>
  );
}

export default EmAlta;