import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import { searchMovies, getPopularMovies } from '../../services/tmdb';
import './style.css';

const MOCK_TRENDING = [
  "Ficção Científica", "Terror", "Drama", "Ação", "Romance", "Animação"
];

const MOCK_RECENT = [
  "Inception", "Interestelar", "The Matrix", "Duna"
];

function Busca() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('Todos');
  const TABS = ['Todos', 'Filmes', 'Séries', 'Pessoas', 'Listas'];

  const [searchInput, setSearchInput] = useState('');
  const [anoDe, setAnoDe] = useState('');
  const [anoAte, setAnoAte] = useState('');
  const [avaliacao, setAvaliacao] = useState('Qualquer');
  const [genero, setGenero] = useState('Todos');

  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedFiltros, setAppliedFiltros] = useState({
    anoDe: '',
    anoAte: '',
    avaliacao: 'Qualquer',
    genero: 'Todos'
  });
  
  const [ordenacao, setOrdenacao] = useState('Mais Relevantes');
  
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search execution trigger
  useEffect(() => {
    const executeSearch = async () => {
      setLoading(true);
      try {
        let data = [];
        if (appliedSearch.trim() === '') {
          data = await getPopularMovies();
        } else {
          data = await searchMovies(appliedSearch);
        }
        setResultados(data);
      } catch (error) {
        console.error("Erro ao realizar busca no TMDB:", error);
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  }, [appliedSearch]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setAppliedSearch(searchInput);
    }
  };

  const handleAplicarFiltros = () => {
    setAppliedFiltros({
      anoDe: anoDe,
      anoAte: anoAte,
      avaliacao: avaliacao,
      genero: genero
    });
  };

  const handleQuickSearch = (term) => {
    setSearchInput(term);
    setAppliedSearch(term);
  };

  const limparBusca = () => {
    setSearchInput('');
    setAppliedSearch('');
  };

  const limparFiltros = () => {
    setAnoDe('');
    setAnoAte('');
    setAvaliacao('Qualquer');
    setGenero('Todos');
    setAppliedFiltros({
      anoDe: '',
      anoAte: '',
      avaliacao: 'Qualquer',
      genero: 'Todos'
    });
  };

  const resultadosFiltrados = useMemo(() => {
    let filtrados = resultados.filter(movie => {
      const matchAnoDe = appliedFiltros.anoDe ? parseInt(movie.year) >= parseInt(appliedFiltros.anoDe) : true;
      const matchAnoAte = appliedFiltros.anoAte ? parseInt(movie.year) <= parseInt(appliedFiltros.anoAte) : true;

      let matchAvaliacao = true;
      if (appliedFiltros.avaliacao === 'Acima de 8.0') matchAvaliacao = movie.rating >= 8.0;
      if (appliedFiltros.avaliacao === 'Acima de 6.0') matchAvaliacao = movie.rating >= 6.0;

      const matchGenero = appliedFiltros.genero === 'Todos' ? true : movie.genre === appliedFiltros.genero;

      return matchAnoDe && matchAnoAte && matchAvaliacao && matchGenero;
    });

    if (ordenacao === 'Mais Recentes') {
      filtrados.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    } else if (ordenacao === 'Maior Nota') {
      filtrados.sort((a, b) => b.rating - a.rating);
    }

    return filtrados;
  }, [resultados, appliedFiltros, ordenacao]);

  return (
    <div className="busca-container">
      <HeaderLogado />
      <main className="busca-main">
        <section className="busca-header-section">
          <h1 className="busca-page-title">Buscar Filmes</h1>
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar por título... (Pressione Enter)" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown} 
            />
            {searchInput && (
              <button className="filter-icon-btn" onClick={limparBusca} title="Limpar Busca">✕</button>
            )}
          </div>
          <div className="busca-tabs">
            {TABS.map(tab => (
              <button 
                key={tab} 
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        <div className="busca-content-grid">
          <aside className="busca-sidebar">
            <div className="sidebar-widget">
              <h3 className="widget-title">📈 Gêneros Populares</h3>
              <ul className="widget-list">
                {MOCK_TRENDING.map((item, index) => (
                  <li key={index}><button onClick={() => handleQuickSearch(item)}>{item}</button></li>
                ))}
              </ul>
            </div>

            <div className="sidebar-widget">
              <div className="widget-header">
                <h3 className="widget-title">🕒 Buscas Recentes</h3>
                <button className="btn-limpar" onClick={limparBusca}>Limpar Tudo</button>
              </div>
              <ul className="widget-list">
                {MOCK_RECENT.map((item, index) => (
                  <li key={index}><button onClick={() => handleQuickSearch(item)}>{item}</button></li>
                ))}
              </ul>
            </div>

            <div className="sidebar-widget">
              <div className="widget-header">
                <h3 className="widget-title">Filtros Avançados</h3>
                <button className="btn-limpar" onClick={limparFiltros}>Zerar Filtros</button>
              </div>
              <div className="filter-form">
                <div className="filter-group">
                  <label>Ano</label>
                  <div className="ano-inputs">
                    <input type="number" placeholder="De" value={anoDe} onChange={(e) => setAnoDe(e.target.value)} />
                    <input type="number" placeholder="Até" value={anoAte} onChange={(e) => setAnoAte(e.target.value)} />
                  </div>
                </div>
                <div className="filter-group">
                  <label>Avaliação Mínima</label>
                  <select value={avaliacao} onChange={(e) => setAvaliacao(e.target.value)}>
                    <option value="Qualquer">Qualquer</option>
                    <option value="Acima de 8.0">Acima de 8.0</option>
                    <option value="Acima de 6.0">Acima de 6.0</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Gênero</label>
                  <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                    <option value="Todos">Todos</option>
                    <option value="Ação">Ação</option>
                    <option value="Drama">Drama</option>
                    <option value="Ficção Científica">Ficção Científica</option>
                    <option value="Comédia">Comédia</option>
                    <option value="Terror">Terror</option>
                  </select>
                </div>
                <button className="btn-aplicar-filtros" onClick={handleAplicarFiltros}>Aplicar Filtros</button>
              </div>
            </div>
          </aside>

          <section className="busca-results-area">
            <div className="results-header">
              <div>
                <h2 className="results-title">
                  {appliedSearch ? `Resultados para "${appliedSearch}"` : "Tendências no Lumière"}
                </h2>
                <p className="results-count">Encontramos {resultadosFiltrados.length} filmes</p>
              </div>
              <select className="sort-select" value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
                <option value="Mais Relevantes">Mais Relevantes</option>
                <option value="Mais Recentes">Mais Recentes</option>
                <option value="Maior Nota">Maior Nota</option>
              </select>
            </div>

            {loading ? (
              <div style={{ color: '#fff', textAlign: 'center', padding: '60px 0' }}>
                <h2 style={{ fontFamily: 'Inter, sans-serif' }}>Buscando respostas no catálogo... 🔍</h2>
              </div>
            ) : (
              <div className="results-grid">
                {resultadosFiltrados.length > 0 ? (
                  resultadosFiltrados.map(movie => (
                    <div key={movie.id} className="movie-card" onClick={() => navigate(`/filme/${movie.id}`)}>
                      <div className="movie-poster">
                        <img src={movie.img} alt={movie.title} />
                      </div>
                      <div className="movie-info">
                        <h4>{movie.title}</h4>
                        <span>{movie.year} • {movie.genre} • ⭐ {movie.rating}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#888', padding: '40px 0', gridColumn: '1 / -1', textAlign: 'center' }}>
                    <h3>Nenhum filme encontrado 🎬</h3>
                    <p>Tente ajustar os filtros ou pesquisar por outro termo.</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Busca;