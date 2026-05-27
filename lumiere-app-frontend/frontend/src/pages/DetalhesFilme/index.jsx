import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderLogado from '../../Components/HeaderLogado';
import { getMovieDetail } from '../../services/tmdb';
import './style.css';

const LOGGED_USER = { name: "João da Silva", handle: "@joaodasilva", initials: "JD" };

const BACKUP_REVIEWS = [
  { 
    id: 1, user: "Maria Silva", handle: "@mariasilva", initials: "MS", time: "3 dias atrás", rating: 5, 
    text: "Um dos melhores filmes que já assisti! A fotografia é espetacular e a narrativa prende do início ao fim.", 
    likes: 24, likedByMe: false, 
    repliesList: [
      { id: 101, user: "Carlos M.", handle: "@carlosm", initials: "CM", time: "2 dias atrás", text: "Concordo totalmente! A trilha sonora no 3º ato me deu arrepios." }
    ] 
  },
  { 
    id: 2, user: "João Santos", handle: "@joaosantos", initials: "JS", time: "5 dias atrás", rating: 4, 
    text: "Excelente produção. O elenco está impecável e a direção conseguiu extrair o melhor de cada cena.", 
    likes: 12, likedByMe: false, 
    repliesList: [] 
  }
];

function DetalhesFilme() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState(BACKUP_REVIEWS);
  
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const [expandedReplies, setExpandedReplies] = useState([]); // Guarda os IDs dos comentários que estão com respostas abertas
  const [replyingTo, setReplyingTo] = useState(null); // Guarda o ID do comentário que estamos respondendo no momento
  const [replyText, setReplyText] = useState(''); // O texto da resposta

  const [isRecommended, setIsRecommended] = useState(false);
  const [shareText, setShareText] = useState('🔗 Compartilhar');
  const [inList, setInList] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const data = await getMovieDetail(id);
        if (data) {
          setMovie(data);
        } else {
          setMovie(null);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const handleToggleLike = (reviewId) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        const isLiked = review.likedByMe;
        return { 
          ...review, 
          likes: isLiked ? review.likes - 1 : review.likes + 1, 
          likedByMe: !isLiked 
        };
      }
      return review;
    }));
  };

  const handleToggleReplies = (reviewId) => {
    if (expandedReplies.includes(reviewId)) {
      setExpandedReplies(expandedReplies.filter(id => id !== reviewId)); // Esconde
    } else {
      setExpandedReplies([...expandedReplies, reviewId]); // Mostra
    }
  };

  const handleOpenReply = (reviewId) => {
    setReplyingTo(replyingTo === reviewId ? null : reviewId); // Alterna entre abrir e fechar a caixa
    setReplyText('');
  };

  const handlePublishReply = (reviewId) => {
    if (replyText.trim() === '') return;

    const newReply = {
      id: Date.now(),
      user: LOGGED_USER.name,
      handle: LOGGED_USER.handle,
      initials: LOGGED_USER.initials,
      time: "Agora mesmo",
      text: replyText
    };

    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return { ...review, repliesList: [...review.repliesList, newReply] };
      }
      return review;
    }));

    setReplyingTo(null);
    setReplyText('');
    // Garante que a seção de respostas vai abrir para vermos o que acabamos de postar
    if (!expandedReplies.includes(reviewId)) {
      setExpandedReplies([...expandedReplies, reviewId]);
    }
  };

  const handlePublish = () => {
    if (userRating === 0) { alert("Selecione uma nota."); return; }
    if (reviewText.trim() === '') { alert("Escreva um comentário."); return; }

    const newReview = {
      id: Date.now(), user: LOGGED_USER.name, handle: LOGGED_USER.handle, initials: LOGGED_USER.initials,
      time: "Agora mesmo", rating: userRating, text: reviewText, likes: 0, likedByMe: false, repliesList: []
    };

    setReviews([newReview, ...reviews]);
    setReviewText(''); setUserRating(0);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareText('✅ Link Copiado!'); setTimeout(() => setShareText('🔗 Compartilhar'), 2000);
    });
  };
  const handleRecommend = () => setIsRecommended(!isRecommended);

  if (loading) {
    return (
      <div className="detalhes-container">
        <HeaderLogado />
        <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Buscando a fita deste filme... 🎬</h2>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="detalhes-container">
        <HeaderLogado />
        <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Filme não encontrado no TMDB 😢</h2>
          <button className="btn-action primary" onClick={() => navigate('/home')}>Voltar para Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="detalhes-container">
      <HeaderLogado />
      <section className="movie-hero" style={{ backgroundImage: `url(${movie.backdrop})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="movie-title">{movie.title}</h1>
          <div className="movie-meta-top">
            <span>{movie.year}</span><span>•</span><span>{movie.duration}</span><span>•</span>
            <span>{movie.director}</span><span>•</span><span className="movie-rating-top">⭐ {movie.rating}/10</span>
          </div>
          <div className="movie-tags">
            {movie.genres.map(genre => <span key={genre} className="tag">{genre}</span>)}
          </div>
        </div>
      </section>

      <main className="detalhes-main">
        <div className="main-content-left">
          <div className="movie-action-bar">
            <button className={`btn-action ${inList ? 'primary' : 'outline'}`} onClick={() => setInList(!inList)}>
              {inList ? '✔️ Na Lista' : '➕ Adicionar à Lista'}
            </button>
            <button className={`btn-action ${isWatched ? 'active-action' : 'outline'}`} onClick={() => setIsWatched(!isWatched)}>
              {isWatched ? '👁️‍🗨️ Visto' : '👁️ Marcar como visto'}
            </button>
            <button className={`btn-action ${isSaved ? 'active-action' : 'outline'}`} onClick={() => setIsSaved(!isSaved)}>
              {isSaved ? '📑 Salvo' : '🔖 Salvar'}
            </button>
            <button className={`btn-action ${isFavorite ? 'active-favorite' : 'outline'}`} onClick={() => setIsFavorite(!isFavorite)}>
              {isFavorite ? '❤️ Favorito' : '🤍 Favorito'}
            </button>
          </div>

          <section className="detail-section">
            <h3 className="section-heading">Sinopse</h3>
            <p className="synopsis-text">{movie.synopsis}</p>
          </section>

          {movie.cast && movie.cast.length > 0 && (
            <section className="detail-section">
              <h3 className="section-heading">Elenco</h3>
              <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                {movie.cast.map((actor, index) => (
                  <div key={index} style={{ flexShrink: 0, textAlign: 'center', width: '90px' }}>
                    <div className="reviewer-avatar" style={{ margin: '0 auto 8px auto', width: '50px', height: '50px', fontSize: '1rem' }}>
                      {actor.initials}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{actor.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{actor.role}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="detail-section">
            <div className="reviews-header">
              <h3 className="section-heading">Avaliações ({reviews.length})</h3>
            </div>

            <div className="write-review-box">
              <h4>Sua Avaliação</h4>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} className={`star ${star <= (hoverRating || userRating) ? 'active' : ''}`}
                    onClick={() => setUserRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                  >★</span>
                ))}
              </div>
              <textarea placeholder="O que você achou deste filme?" value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows="3"></textarea>
              <div className="review-footer">
                <span className="review-hint">Seja respeitoso em seus comentários.</span>
                <button className="btn-publish" onClick={handlePublish}>Publicar</button>
              </div>
            </div>

            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review.id} className="review-wrapper">
                  <div className="review-card">
                    <div className="reviewer-avatar">{review.initials || review.user.substring(0, 2).toUpperCase()}</div>
                    <div className="review-content">
                      <div className="review-meta">
                        <strong>{review.user} <span className="handle">{review.handle}</span></strong>
                        <span className="time">{review.time}</span>
                      </div>
                      <div className="review-stars">{'★'.repeat(review.rating)}</div>
                      <p>{review.text}</p>
                      
                      <div className="review-actions">
                        <button 
                          className={review.likedByMe ? 'action-liked' : ''} 
                          onClick={() => handleToggleLike(review.id)}
                        >
                          👍 {review.likes}
                        </button>
                        <button onClick={() => handleToggleReplies(review.id)}>
                          💬 {review.repliesList.length} respostas
                        </button>
                        <button onClick={() => handleOpenReply(review.id)}>
                          Responder
                        </button>
                      </div>

                      {replyingTo === review.id && (
                        <div className="reply-input-box">
                          <textarea 
                            placeholder={`Respondendo a ${review.handle}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows="2"
                            autoFocus
                          ></textarea>
                          <div className="reply-input-actions">
                            <button className="btn-cancel-reply" onClick={() => setReplyingTo(null)}>Cancelar</button>
                            <button className="btn-publish-reply" onClick={() => handlePublishReply(review.id)}>Enviar</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {expandedReplies.includes(review.id) && review.repliesList.length > 0 && (
                    <div className="replies-container">
                      {review.repliesList.map(reply => (
                        <div key={reply.id} className="reply-card">
                          <div className="reviewer-avatar reply-avatar">{reply.initials}</div>
                          <div className="review-content">
                            <div className="review-meta">
                              <strong>{reply.user} <span className="handle">{reply.handle}</span></strong>
                              <span className="time">{reply.time}</span>
                            </div>
                            <p>{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="main-content-right">
          <div className="info-widget">
            <h3>Informações</h3>
            <div className="info-row highlight"><span>Avaliação Média</span><strong>⭐ {movie.rating}/10</strong></div>
            <div className="info-row"><span>Duração</span><strong>⏱️ {movie.duration}</strong></div>
            <div className="info-row"><span>Lançamento</span><strong>{movie.year}</strong></div>
            <div className="info-row"><span>Diretor</span><strong>{movie.director}</strong></div>
            <div className="info-row no-border">
              <span>Gêneros</span><div className="small-tags">{movie.genres.map(genre => <span key={genre}>{genre}</span>)}</div>
            </div>
          </div>
          
          <div className="info-widget">
            <h3>Comunidade</h3>
            <div className="stats-list">
              <div className="stat-item"><span>Assistiram</span> <strong>{movie.stats.watched}</strong></div>
              <div className="stat-item"><span>Nas Listas</span> <strong>{movie.stats.lists}</strong></div>
              <div className="stat-item"><span>Favoritaram</span> <strong>{movie.stats.favorites}</strong></div>
              <div className="stat-item"><span>Comentários</span> <strong>{reviews.length}</strong></div>
            </div>
          </div>

          {movie.recommendations && movie.recommendations.length > 0 && (
            <div className="info-widget">
              <h3>Recomendados</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                {movie.recommendations.map(r => (
                  <div key={r.id} style={{ display: 'flex', gap: '10px', cursor: 'pointer' }} onClick={() => navigate(`/filme/${r.id}`)}>
                    <img src={r.img} alt={r.title} style={{ width: '45px', height: '65px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                      <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</span>
                      <span style={{ fontSize: '0.75rem', color: '#888' }}>{r.year} • ⭐ {r.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="info-widget">
            <h3>Interagir</h3>
            <button className="btn-widget-action" onClick={handleShare}>{shareText}</button>
            <button className={`btn-widget-action ${isRecommended ? 'recommended-active' : ''}`} onClick={handleRecommend}>
              {isRecommended ? '❤️ Recomendado' : '♡ Recomendar'}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default DetalhesFilme;