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
    res.json(rows);
  } catch (error) {
    console.error("Erro ao obter listas:", error);
    res.status(500).json({ erro: "Erro ao carregar listas" });
  }
};

module.exports = {
  listarOpinioes,
  buscarUsuarios,
  postarOpiniao,
  avaliarFilme,
  criarLista,
  adicionarFilmeLista,
  obterListasUsuario
};
