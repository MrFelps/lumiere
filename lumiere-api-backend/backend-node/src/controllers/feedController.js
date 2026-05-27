const crypto = require("crypto");
const db = require("../services/db");

const listarOpinioes = async (req, res) => {
  try {
    const q = `
      SELECT r.id, r.user_id as usuarioId, p.name as usuario, r.movie_title as filme, r.comment as opiniao, r.created_at as data
      FROM reviews r
      JOIN profiles p ON p.user_id = r.user_id
      ORDER BY r.created_at DESC
    `;
    const rows = await db.query(q);
    
    if (rows.length === 0) {
      return res.json([
        { id: "mock-1", usuarioId: "mock-user-1", usuario: "Felipe Gabriel", filme: "A Viagem de Chihiro", opiniao: "Uma obra-prima absoluta da animação! Cada detalhe é mágico.", data: "2 dias atrás" },
        { id: "mock-2", usuarioId: "mock-user-2", usuario: "Letícia M.", filme: "Parasita", opiniao: "Excelente suspense com crítica social impecável! Roteiro espetacular.", data: "5 dias atrás" }
      ]);
    }

    const formatted = rows.map(r => {
      let dataStr = "Recentemente";
      try {
        const dataObjeto = new Date(r.data);
        dataStr = dataObjeto.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } catch (e) {}
      
      return {
        ...r,
        data: dataStr
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Erro ao listar opiniões:", error);
    res.status(500).json({ erro: "Erro ao obter feed de opiniões" });
  }
};

const buscarUsuarios = async (req, res) => {
  const { nome } = req.query;
  try {
    let rows;
    if (!nome) {
      rows = await db.query("SELECT u.id, p.name as nome, u.email FROM users u JOIN profiles p ON p.user_id = u.id LIMIT 20");
    } else {
      rows = await db.query(
        "SELECT u.id, p.name as nome, u.email FROM users u JOIN profiles p ON p.user_id = u.id WHERE p.name LIKE ? OR u.username LIKE ?",
        [`%${nome}%`, `%${nome}%`]
      );
    }
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ erro: "Erro ao buscar usuários" });
  }
};

const postarOpiniao = async (req, res) => {
  const { movie_id, movie_title, comment } = req.body;
  
  if (!movie_id || !comment) {
    return res.status(400).json({ erro: "ID do filme e comentário são obrigatórios" });
  }

  try {
    const id = crypto.randomUUID();
    await db.run(
      "INSERT INTO reviews (id, user_id, movie_id, movie_title, comment) VALUES (?, ?, ?, ?, ?)",
      [id, req.usuarioId, movie_id.toString(), movie_title || "Filme", comment]
    );
    res.status(201).json({ mensagem: "Comentário publicado com sucesso!" });
  } catch (error) {
    console.error("Erro ao postar opinião:", error);
    res.status(500).json({ erro: "Erro ao publicar comentário" });
  }
};

const avaliarFilme = async (req, res) => {
  const { movie_id, rating } = req.body;
  if (!movie_id || rating === undefined) {
    return res.status(400).json({ erro: "ID do filme e nota são obrigatórios" });
  }
  const ratingInt = parseInt(rating);
  if (ratingInt < 1 || ratingInt > 5) {
    return res.status(400).json({ erro: "A nota deve estar entre 1 e 5 estrelas" });
  }
  try {
    await db.run("DELETE FROM ratings WHERE user_id = ? AND movie_id = ?", [req.usuarioId, movie_id.toString()]);
    await db.run(
      "INSERT INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?)",
      [req.usuarioId, movie_id.toString(), ratingInt]
    );
    res.status(200).json({ mensagem: "Avaliação registrada com sucesso!" });
  } catch (error) {
    console.error("Erro ao avaliar filme:", error);
    res.status(500).json({ erro: "Erro ao salvar avaliação" });
  }
};

const criarLista = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ erro: "Nome da lista é obrigatório" });
  }
  try {
    const id = crypto.randomUUID();
    await db.run(
      "INSERT INTO lists (id, user_id, name, description) VALUES (?, ?, ?, ?)",
      [id, req.usuarioId, name, description || ""]
    );
    res.status(201).json({ id, nome: name, mensagem: "Lista criada com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar lista:", error);
    res.status(500).json({ erro: "Erro ao criar lista" });
  }
};

const adicionarFilmeLista = async (req, res) => {
  const { list_id, movie_id, movie_title, movie_poster } = req.body;
  if (!list_id || !movie_id) {
    return res.status(400).json({ erro: "ID da lista e ID do filme são obrigatórios" });
  }
  try {
    const lista = await db.get("SELECT * FROM lists WHERE id = ? AND user_id = ?", [list_id, req.usuarioId]);
    if (!lista) {
      return res.status(404).json({ erro: "Lista não encontrada ou sem permissão" });
    }
    await db.run("DELETE FROM list_movies WHERE list_id = ? AND movie_id = ?", [list_id, parseInt(movie_id)]);
    await db.run(
      "INSERT INTO list_movies (list_id, movie_id, movie_title, movie_poster) VALUES (?, ?, ?, ?)",
      [list_id, parseInt(movie_id), movie_title || "Filme", movie_poster || ""]
    );
    res.status(201).json({ mensagem: "Filme adicionado à lista com sucesso!" });
  } catch (error) {
    console.error("Erro ao adicionar filme à lista:", error);
    res.status(500).json({ erro: "Erro ao adicionar filme" });
  }
};

const obterListasUsuario = async (req, res) => {
  try {
    const q = `
      SELECT l.id, l.name as nome, l.description, COUNT(lm.movie_id) as qtd
      FROM lists l
      LEFT JOIN list_movies lm ON lm.list_id = l.id
      WHERE l.user_id = ?
      GROUP BY l.id, l.name, l.description
      ORDER BY l.created_at DESC
    `;
    const rows = await db.query(q, [req.usuarioId]);
    
    const listasComCapas = [];
    for (const r of rows) {
      const covers = await db.query(
        "SELECT movie_poster FROM list_movies WHERE list_id = ? ORDER BY created_at DESC LIMIT 3",
        [r.id]
      );
      listasComCapas.push({
        ...r,
        covers: covers.map(c => c.movie_poster).filter(Boolean)
      });
    }

    res.json(listasComCapas);
  } catch (error) {
    console.error("Erro ao obter listas:", error);
    res.status(500).json({ erro: "Erro ao carregar listas" });
  }
};

const seguirUsuario = async (req, res) => {
  const { followed_id } = req.body;
  
  if (!followed_id) {
    return res.status(400).json({ erro: "ID do usuário a seguir é obrigatório" });
  }

  if (followed_id === req.usuarioId) {
    return res.status(400).json({ erro: "Você não pode seguir a si mesmo" });
  }

  try {
    // Verifica se já segue
    const existente = await db.get(
      "SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?",
      [req.usuarioId, followed_id]
    );

    if (existente) {
      // Deixar de seguir
      await db.run(
        "DELETE FROM follows WHERE follower_id = ? AND followed_id = ?",
        [req.usuarioId, followed_id]
      );
      res.json({ seguindo: false, mensagem: "Deixou de seguir o usuário com sucesso!" });
    } else {
      // Seguir
      await db.run(
        "INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)",
        [req.usuarioId, followed_id]
      );
      res.json({ seguindo: true, mensagem: "Seguiu o usuário com sucesso!" });
    }
  } catch (error) {
    console.error("Erro ao seguir/deixar de seguir usuário:", error);
    res.status(500).json({ erro: "Erro ao processar solicitação de seguir" });
  }
};

const obterDetalhesLista = async (req, res) => {
  const { id } = req.params;
  try {
    const lista = await db.get(
      `SELECT l.id, l.name as nome, l.description, p.name as creator, u.username
       FROM lists l
       JOIN users u ON u.id = l.user_id
       JOIN profiles p ON p.user_id = l.user_id
       WHERE l.id = ?`,
      [id]
    );

    if (!lista) {
      return res.status(404).json({ erro: "Lista não encontrada" });
    }

    const movies = await db.query(
      `SELECT movie_id as id, movie_title as title, movie_poster as img, created_at
       FROM list_movies
       WHERE list_id = ?
       ORDER BY created_at DESC`,
      [id]
    );

    res.json({
      id: lista.id,
      nome: lista.nome,
      description: lista.description,
      creator: lista.creator,
      username: lista.username,
      movies: movies || []
    });
  } catch (error) {
    console.error("Erro ao obter detalhes da lista:", error);
    res.status(500).json({ erro: "Erro ao carregar detalhes da lista" });
  }
};

const toggleAssistido = async (req, res) => {
  const { movie_id, movie_title, movie_poster, runtime } = req.body;
  if (!movie_id) {
    return res.status(400).json({ erro: "ID do filme é obrigatório" });
  }
  try {
    const existente = await db.get(
      "SELECT * FROM watched WHERE user_id = ? AND movie_id = ?",
      [req.usuarioId, parseInt(movie_id)]
    );
    if (existente) {
      await db.run(
        "DELETE FROM watched WHERE user_id = ? AND movie_id = ?",
        [req.usuarioId, parseInt(movie_id)]
      );
      res.json({ assistido: false, mensagem: "Removido de assistidos" });
    } else {
      await db.run(
        "INSERT INTO watched (user_id, movie_id, movie_title, movie_poster, runtime) VALUES (?, ?, ?, ?, ?)",
        [req.usuarioId, parseInt(movie_id), movie_title || "Filme", movie_poster || "", parseInt(runtime) || 0]
      );
      res.json({ assistido: true, mensagem: "Marcado como assistido!" });
    }
  } catch (error) {
    console.error("Erro ao marcar assistido:", error);
    res.status(500).json({ erro: "Erro ao atualizar estado de assistido" });
  }
};

const obterEstadoAssistido = async (req, res) => {
  const { movie_id } = req.query;
  if (!movie_id) return res.status(400).json({ erro: "ID do filme é obrigatório" });
  try {
    const row = await db.get(
      "SELECT * FROM watched WHERE user_id = ? AND movie_id = ?",
      [req.usuarioId, parseInt(movie_id)]
    );
    res.json({ assistido: !!row });
  } catch (error) {
    console.error("Erro ao checar assistido:", error);
    res.status(500).json({ erro: "Erro ao obter estado" });
  }
};

const removerFilmeLista = async (req, res) => {
  const { list_id, movie_id } = req.body;
  if (!list_id || !movie_id) {
    return res.status(400).json({ erro: "ID da lista e ID do filme são obrigatórios" });
  }
  try {
    const lista = await db.get("SELECT * FROM lists WHERE id = ? AND user_id = ?", [list_id, req.usuarioId]);
    if (!lista) {
      return res.status(404).json({ erro: "Lista não encontrada ou sem permissão" });
    }
    await db.run(
      "DELETE FROM list_movies WHERE list_id = ? AND movie_id = ?",
      [list_id, parseInt(movie_id)]
    );
    res.json({ mensagem: "Filme removido da lista com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover filme da lista:", error);
    res.status(500).json({ erro: "Erro ao remover filme" });
  }
};

const obterOpinioesFilme = async (req, res) => {
  const { movie_id } = req.params;
  try {
    const q = `
      SELECT r.id, r.user_id as usuarioId, p.name as usuario, u.username, r.comment as texto, r.created_at as data, rat.rating
      FROM reviews r
      JOIN profiles p ON p.user_id = r.user_id
      JOIN users u ON u.id = r.user_id
      LEFT JOIN ratings rat ON rat.user_id = r.user_id AND rat.movie_id = r.movie_id
      WHERE r.movie_id = ?
      ORDER BY r.created_at DESC
    `;
    const rows = await db.query(q, [movie_id.toString()]);
    
    const formatted = rows.map(r => {
      let dataStr = "Recentemente";
      try {
        const dataObjeto = new Date(r.data);
        dataStr = dataObjeto.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } catch (e) {}
      
      return {
        id: r.id,
        user: r.usuario,
        handle: r.username ? `@${r.username}` : `@usuario`,
        initials: r.usuario ? r.usuario.substring(0, 2).toUpperCase() : "U",
        time: dataStr,
        rating: r.rating || 5,
        text: r.texto,
        likes: 0,
        likedByMe: false,
        repliesList: []
      };
    });
    res.json(formatted);
  } catch (error) {
    console.error("Erro ao obter opiniões do filme:", error);
    res.status(500).json({ erro: "Erro ao obter opiniões" });
  }
};

module.exports = {
  listarOpinioes,
  buscarUsuarios,
  postarOpiniao,
  avaliarFilme,
  criarLista,
  adicionarFilmeLista,
  obterListasUsuario,
  seguirUsuario,
  obterDetalhesLista,
  toggleAssistido,
  obterEstadoAssistido,
  removerFilmeLista,
  obterOpinioesFilme
};
