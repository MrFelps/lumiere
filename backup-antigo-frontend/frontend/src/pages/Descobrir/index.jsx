import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import './style.css';

// ==========================================
// MOCK DATA (Categorias e Coleções)
// ==========================================
const MOCK_GENRES = [
  { id: 1, name: "Ação", emoji: "💥", color: "linear-gradient(135deg, #ef4444, #991b1b)" },
  { id: 2, name: "Comédia", emoji: "😂", color: "linear-gradient(135deg, #f59e0b, #b45309)" },
  { id: 3, name: "Drama", emoji: "🎭", color: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
  { id: 4, name: "Ficção Científica", emoji: "👽", color: "linear-gradient(135deg, #8b5cf6, #5b21b6)" },
  { id: 5, name: "Terror", emoji: "👻", color: "linear-gradient(135deg, #10b981, #047857)" },
  { id: 6, name: "Romance", emoji: "❤️", color: "linear-gradient(135deg, #ec4899, #be185d)" },
  { id: 7, name: "Animação", emoji: "🎨", color: "linear-gradient(135deg, #0ea5e9, #0369a1)" },
  { id: 8, name: "Documentário", emoji: "📹", color: "linear-gradient(135deg, #64748b, #334155)" }
];

const MOCK_MOODS = [
  { id: 1, title: "Para Relaxar", subtitle: "Filmes leves para desligar a mente", img: "https://images.unsplash.com/photo-1499806548232-a5676dbbf92e?w=600" },
  { id: 2, title: "Tensão Pura", subtitle: "Fique na ponta do sofá", img: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600" },
  { id: 3, title: "Rir até doer", subtitle: "As melhores comédias do ano", img: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=600" },
  { id: 4, title: "Chorar rios", subtitle: "Prepare os lencinhos", img: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=600" }
];

function Descobrir() {
  const navigate = useNavigate();

  // Função que futuramente vai enviar o gênero para a tela de Busca ou Listagem
  const handleCategoryClick = (categoryName) => {
    console.log(`Buscando por: ${categoryName}`);
    navigate('/filmes', { state: { categoriaInicial: categoryName } });
  };

  return (
    <div className="descobrir-container">
      <HeaderLogado />
      
      <main className="descobrir-main">
        <header className="descobrir-header">
          <h1 className="descobrir-title">O que você quer assistir hoje?</h1>
          <p className="descobrir-subtitle">Explore nosso catálogo por gênero, humor ou coleções especiais.</p>
        </header>

        <section className="descobrir-section">
          <h2 className="section-title">Explorar por Gênero</h2>
          <div className="genres-grid">
            {MOCK_GENRES.map(genre => (
              <div 
                key={genre.id} 
                className="genre-card" 
                style={{ background: genre.color }}
                onClick={() => handleCategoryClick(genre.name)}
              >
                <span className="genre-emoji">{genre.emoji}</span>
                <h3 className="genre-name">{genre.name}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="descobrir-section">
          <h2 className="section-title">Escolha pela sua Vibe</h2>
          <div className="moods-grid">
            {MOCK_MOODS.map(mood => (
              <div 
                key={mood.id} 
                className="mood-card" 
                style={{ backgroundImage: `url(${mood.img})` }}
                onClick={() => handleCategoryClick(mood.title)}
              >
                <div className="mood-overlay"></div>
                <div className="mood-content">
                  <h3 className="mood-title">{mood.title}</h3>
                  <p className="mood-subtitle">{mood.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="descobrir-banner-ia" onClick={() => navigate('/ia')}>
          <div className="banner-ia-content">
            <h2>Ainda não sabe o que assistir?</h2>
            <p>Deixe a Lumière AI encontrar o filme perfeito para você baseado nos seus gostos.</p>
            <button className="btn-ia-discover">✨ Perguntar à IA</button>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Descobrir;