import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import { getTopRatedMovies, discoverMoviesByGenre, getPopularMovies } from '../../services/tmdb';
import './style.css';

const BACKUP_LISTA = {
  id: 1,
  title: "Clássicos Imperdíveis",
  description: "Uma seleção definitiva dos filmes que moldaram a história do cinema. Se você ainda não assistiu a esses, pare o que está fazendo e comece agora!",
  creator: "João da Silva",
  initials: "JD",
  likes: 342,
  movieCount: 4,
  movies: []
};

function DetalhesLista() {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [lista, setLista] = useState(BACKUP_LISTA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListaDetails = async () => {
      setLoading(true);
      try {
        let title = "Clássicos Imperdíveis";
        let description = "Uma seleção definitiva dos filmes que moldaram a história do cinema. Se você ainda não assistiu a esses, pare o que está fazendo e comece agora!";
        let creator = "João da Silva";
        let initials = "JD";
        let likes = 342;
        let moviesFetched = [];

        if (id === "1") {
          moviesFetched = await getTopRatedMovies();
        } else if (id === "2") {
          title = "Ficção Científica Cabeça";
          description = "Viagens espaciais, inteligência artificial, realidades paralelas e reflexões existenciais. O melhor da ficção científica inteligente.";
          creator = "Maria Silva";
          initials = "MS";
          likes = 890;
          moviesFetched = await discoverMoviesByGenre("Ficção Científica");
        } else if (id === "3") {
          title = "Noites de Terror";
          description = "Filmes para assistir no escuro (ou com as luzes acesas!). O melhor do terror psicológico, sobrenatural e slasher.";
          creator = "Lucas Santos";
          initials = "LS";
          likes = 125;
          moviesFetched = await discoverMoviesByGenre("Terror");
        } else {
          title = "Minha Coleção Especial";
          description = "Uma lista personalizada de filmes incríveis salvos para assistir depois.";
          creator = "João da Silva";
          initials = "JD";
          likes = 0;
          moviesFetched = await getPopularMovies();
        }

        setLista({
          id,
          title,
          description,
          creator,
          initials,
          likes,
          movieCount: moviesFetched.slice(0, 12).length, // Correção: conta exatamente a quantidade exibida (12)
          movies: moviesFetched.slice(0, 12) // Mostra os 12 primeiros
        });
      } catch (error) {
        console.error("Erro ao buscar detalhes da lista:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListaDetails();
  }, [id]);

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
          
          {loading ? (
            <div style={{ marginTop: '20px', color: '#fff' }}>
              <h2>Carregando detalhes da coleção... 🎬</h2>
            </div>
          ) : (
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
          )}
        </header>

        {!loading && (
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
        )}
      </main>
    </div>
  );
}

export default DetalhesLista;