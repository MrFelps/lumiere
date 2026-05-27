import axios from "axios";

const API_KEY = "9f55a0675293bcb6d6d36e5a6cc39a39";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "pt-BR",
  },
});

const GENRE_MAP = {
  28: 'Ação',
  12: 'Aventura',
  16: 'Animação',
  35: 'Comédia',
  80: 'Crime',
  99: 'Documentário',
  18: 'Drama',
  10751: 'Família',
  14: 'Fantasia',
  36: 'História',
  27: 'Terror',
  10402: 'Música',
  9648: 'Mistério',
  10749: 'Romance',
  878: 'Ficção Científica',
  10770: 'Cinema TV',
  53: 'Suspense',
  10752: 'Guerra',
  37: 'Faroeste'
};

const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

export const getPopularMovies = async () => {
  try {
    const response = await tmdbApi.get("/movie/popular");
    return response.data.results.map((m) => ({
      id: m.id,
      title: m.title || m.original_title,
      year: m.release_date ? m.release_date.split("-")[0] : "N/A",
      rating: parseFloat(m.vote_average.toFixed(1)),
      img: m.poster_path ? `${IMAGE_BASE_URL}/w500${m.poster_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
      backdrop: m.backdrop_path ? `${IMAGE_BASE_URL}/w1280${m.backdrop_path}` : "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=1600",
      genres: m.genre_ids ? m.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean) : [],
      synopsis: m.overview || "Sem sinopse disponível."
    }));
  } catch (error) {
    console.error("Erro ao buscar filmes populares no TMDB:", error);
    return [];
  }
};

export const getTopRatedMovies = async () => {
  try {
    const response = await tmdbApi.get("/movie/top_rated");
    return response.data.results.map((m) => ({
      id: m.id,
      title: m.title || m.original_title,
      year: m.release_date ? m.release_date.split("-")[0] : "N/A",
      rating: parseFloat(m.vote_average.toFixed(1)),
      img: m.poster_path ? `${IMAGE_BASE_URL}/w500${m.poster_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
      backdrop: m.backdrop_path ? `${IMAGE_BASE_URL}/w1280${m.backdrop_path}` : "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=1600",
      genres: m.genre_ids ? m.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean) : [],
      synopsis: m.overview || "Sem sinopse disponível."
    }));
  } catch (error) {
    console.error("Erro ao buscar filmes mais votados no TMDB:", error);
    return [];
  }
};

export const getMovieDetail = async (movieId) => {
  try {
    const detailRes = await tmdbApi.get(`/movie/${movieId}`);
    const creditsRes = await tmdbApi.get(`/movie/${movieId}/credits`);
    const recommendationsRes = await tmdbApi.get(`/movie/${movieId}/recommendations`);

    const m = detailRes.data;
    const cast = creditsRes.data.cast.slice(0, 10).map((c) => ({
      name: c.name,
      role: c.character,
      initials: getInitials(c.name),
    }));

    const directorObj = creditsRes.data.crew.find((member) => member.job === "Director");
    const director = directorObj ? directorObj.name : "Diretor Desconhecido";

    const durationHrs = Math.floor(m.runtime / 60);
    const durationMins = m.runtime % 60;
    const durationStr = durationHrs > 0 ? `${durationHrs}h ${durationMins}min` : `${durationMins}min`;

    const recommendations = recommendationsRes.data.results.slice(0, 5).map((r) => ({
      id: r.id,
      title: r.title,
      year: r.release_date ? r.release_date.split("-")[0] : "N/A",
      rating: parseFloat(r.vote_average.toFixed(1)),
      img: r.poster_path ? `${IMAGE_BASE_URL}/w500${r.poster_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
    }));

    // Generate some premium-looking stats based on TMDB stats
    const popularityK = (m.popularity / 10).toFixed(1);
    const voteCountK = m.vote_count > 1000 ? `${(m.vote_count / 1000).toFixed(1)}K` : m.vote_count.toString();
    const favoritesK = Math.round(m.vote_count * 0.45);
    const favoritesStr = favoritesK > 1000 ? `${(favoritesK / 1000).toFixed(1)}K` : favoritesK.toString();

    return {
      id: m.id,
      title: m.title || m.original_title,
      year: m.release_date ? m.release_date.split("-")[0] : "N/A",
      duration: durationStr,
      director: director,
      rating: parseFloat(m.vote_average.toFixed(1)),
      genres: m.genres ? m.genres.map(g => g.name) : [],
      synopsis: m.overview || "Sem sinopse disponível.",
      backdrop: m.backdrop_path ? `${IMAGE_BASE_URL}/w1280${m.backdrop_path}` : "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=1600",
      cast: cast,
      stats: {
        watched: `${popularityK}K`,
        lists: voteCountK,
        favorites: favoritesStr,
        comments: (m.vote_count % 199).toString(),
      },
      recommendations: recommendations,
    };
  } catch (error) {
    console.error(`Erro ao buscar detalhes do filme ${movieId} no TMDB:`, error);
    return null;
  }
};

export const searchMovies = async (query) => {
  if (!query) return [];
  try {
    const response = await tmdbApi.get("/search/movie", {
      params: { query },
    });
    return response.data.results.map((m) => ({
      id: m.id,
      title: m.title || m.original_title,
      year: m.release_date ? m.release_date.split("-")[0] : "N/A",
      rating: parseFloat(m.vote_average.toFixed(1)),
      genre: m.genre_ids && m.genre_ids.length > 0 ? GENRE_MAP[m.genre_ids[0]] || "Drama" : "Drama",
      img: m.poster_path ? `${IMAGE_BASE_URL}/w500${m.poster_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
    }));
  } catch (error) {
    console.error("Erro ao realizar busca no TMDB:", error);
    return [];
  }
};

export const discoverMoviesByGenre = async (genreName) => {
  try {
    const genreId = Object.keys(GENRE_MAP).find(key => GENRE_MAP[key].toLowerCase() === genreName.toLowerCase());
    const params = genreId ? { with_genres: genreId } : {};
    
    const response = await tmdbApi.get("/discover/movie", { params });
    return response.data.results.map((m) => ({
      id: m.id,
      title: m.title || m.original_title,
      year: m.release_date ? m.release_date.split("-")[0] : "N/A",
      rating: parseFloat(m.vote_average.toFixed(1)),
      genre: m.genre_ids && m.genre_ids.length > 0 ? GENRE_MAP[m.genre_ids[0]] || genreName : genreName,
      img: m.poster_path ? `${IMAGE_BASE_URL}/w500${m.poster_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
    }));
  } catch (error) {
    console.error(`Erro ao filtrar filmes por gênero (${genreName}) no TMDB:`, error);
    return [];
  }
};

export const getTrendingMovies = async (timeWindow = "day") => {
  try {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
    return response.data.results.map((m) => ({
      id: m.id,
      title: m.title || m.original_title,
      year: m.release_date ? m.release_date.split("-")[0] : "N/A",
      rating: parseFloat(m.vote_average.toFixed(1)),
      genre: m.genre_ids && m.genre_ids.length > 0 ? GENRE_MAP[m.genre_ids[0]] || "Ação" : "Ação",
      img: m.poster_path ? `${IMAGE_BASE_URL}/w500${m.poster_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
    }));
  } catch (error) {
    console.error(`Erro ao buscar tendências (${timeWindow}) no TMDB:`, error);
    return [];
  }
};

