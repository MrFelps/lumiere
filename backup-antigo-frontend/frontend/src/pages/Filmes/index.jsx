import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import './style.css';

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_CATALOGO = [
  { id: 1, title: "Cidade Sombria", year: "2024", genre: "Ação", rating: 8.5, img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400" },
  { id: 2, title: "Noite Eterna", year: "2023", genre: "Drama", rating: 7.2, img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400" },
  { id: 3, title: "Além das Estrelas", year: "2025", genre: "Ficção Científica", rating: 9.1, img: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400" },
  { id: 4, title: "Corações em Conflito", year: "2024", genre: "Romance", rating: 6.5, img: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400" },
  { id: 5, title: "A Casa Silenciosa", year: "2024", genre: "Terror", rating: 5.8, img: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400" },
  { id: 6, title: "Risadas no Tempo", year: "2025", genre: "Comédia", rating: 7.8, img: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400" },
  { id: 7, title: "Montanhas da Aventura", year: "2024", genre: "Ação", rating: 8.0, img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400" },
  { id: 8, title: "Reino dos Sonhos", year: "2025", genre: "Ficção Científica", rating: 8.8, img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400" },
  { id: 9, title: "Vida em Cores", year: "2023", genre: "Animação", rating: 8.2, img: "https://images.unsplash.com/photo-1499806548232-a5676dbbf92e?w=400" }
];

const TODOS_GENEROS = ["Todos", "Ação", "Comédia", "Drama", "Ficção Científica", "Terror", "Romance", "Animação", "Documentário"];

function Filmes() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verifica se veio alguma categoria clicada lá da tela de Descobrir
  const categoriaDaRota = location.state?.categoriaInicial || "Todos";

  const [categoriaAtiva, setCategoriaAtiva] = useState(categoriaDaRota);

  // Se a rota mudar (usuário clicou em outro card lá no Descobrir), atualizamos o estado
  useEffect(() => {
    if (location.state?.categoriaInicial) {
      setCategoriaAtiva(location.state.categoriaInicial);
    }
  }, [location.state]);

  // Lógica de Filtragem (Se for um Mood/Vibe como "Para Relaxar", podemos mapear para Comédia/Animação no futuro)
  const filmesExibidos = MOCK_CATALOGO.filter(filme => {
    if (categoriaAtiva === "Todos") return true;
    
    // Simulação rápida para as "Vibes" da tela descobrir
    if (categoriaAtiva === "Para Relaxar") return filme.genre === "Comédia" || filme.genre === "Animação";
    if (categoriaAtiva === "Tensão Pura") return filme.genre === "Terror" || filme.genre === "Ação";
    if (categoriaAtiva === "Rir até doer") return filme.genre === "Comédia";
    if (categoriaAtiva === "Chorar rios") return filme.genre === "Drama" || filme.genre === "Romance";

    // Se for gênero normal
    return filme.genre === categoriaAtiva;
  });

  return (
    <div className="filmes-container">
      <HeaderLogado />
      
      <main className="filmes-main">
        <header className="filmes-header">
          <h1 className="filmes-title">Catálogo de Filmes</h1>
          <p className="filmes-subtitle">
            {categoriaAtiva === "Todos" 
              ? "Navegue por todos os filmes disponíveis na Lumière." 
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
      </main>
    </div>
  );
}

export default Filmes;