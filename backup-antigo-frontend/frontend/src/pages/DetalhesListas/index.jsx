import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import './style.css';

// ==========================================
// MOCK DATA (Simulando os dados específicos de uma lista)
// ==========================================
const MOCK_LISTA_INFO = {
  id: 1,
  title: "Clássicos Imperdíveis",
  description: "Uma seleção definitiva dos filmes que moldaram a história do cinema. Se você ainda não assistiu a esses, pare o que está fazendo e comece agora!",
  creator: "João da Silva",
  initials: "JD",
  likes: 342,
  movieCount: 4,
  movies: [
    { id: 1, title: "Cidade Sombria", year: "2024", genre: "Ação", rating: 8.5, img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400" },
    { id: 2, title: "Noite Eterna", year: "2023", genre: "Drama", rating: 7.2, img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400" },
    { id: 3, title: "Além das Estrelas", year: "2025", genre: "Ficção Científica", rating: 9.1, img: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400" },
    { id: 4, title: "Corações em Conflito", year: "2024", genre: "Romance", rating: 6.5, img: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400" }
  ]
};

function DetalhesLista() {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  // Na vida real, usaríamos o 'id' para buscar no banco de dados. Aqui usamos o Mock.
  const lista = MOCK_LISTA_INFO;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert("Link da lista copiado com sucesso!"));
  };

  return (
    <div className="detalhes-lista-container">
      <HeaderLogado />
      
      <main className="detalhes-lista-main">
        <header className="lista-hero-header">
          <button className="btn-voltar" onClick={() => navigate(-1)}>← Voltar para Listas</button>
          
          <div className="lista-hero-content">
            <h1 className="lista-hero-title">{lista.title}</h1>
            <p className="lista-hero-desc">{lista.description}</p>
            
            <div className="lista-hero-meta">
              <div className="creator-badge">
                <div className="creator-avatar">{lista.initials}</div>
                <span>Criada por <strong>{lista.creator}</strong></span>
              </div>
              <span className="meta-dot">•</span>
              <span>{lista.movieCount} filmes</span>
            </div>

            <div className="lista-hero-actions">
              <button 
                className={`btn-lista-action ${isLiked ? 'liked' : ''}`} 
                onClick={() => setIsLiked(!isLiked)}
              >
                {isLiked ? '❤️ Curtiu' : '🤍 Curtir Lista'} ({isLiked ? lista.likes + 1 : lista.likes})
              </button>
              <button className="btn-lista-action outline" onClick={handleShare}>
                🔗 Compartilhar
              </button>
            </div>
          </div>
        </header>

        <section className="lista-movies-section">
          <h2 className="section-title">Filmes nesta lista</h2>
          
          <div className="lista-movies-grid">
            {lista.movies.map((movie, index) => (
              <div key={movie.id} className="lista-movie-card" onClick={() => navigate(`/filme/${movie.id}`)}>
                <div className="movie-order-badge">{index + 1}</div>
                <div className="lista-movie-poster">
                  <img src={movie.img} alt={movie.title} />
                  <div className="lista-movie-rating">⭐ {movie.rating}</div>
                </div>
                <h4 className="lista-movie-title">{movie.title}</h4>
                <div className="lista-movie-meta">
                  <span>{movie.year}</span>
                  <span>•</span>
                  <span>{movie.genre}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DetalhesLista;