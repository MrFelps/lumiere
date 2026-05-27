const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../services/db");

const cadastrar = async (req, res) => {
  const { nome, email, senha, username } = req.body;
  
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
  }

  try {
    // Verifica se e-mail já existe
    const usuarioExistente = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (usuarioExistente) {
      return res.status(400).json({ erro: "Email ja cadastrado" });
    }

    // Define nome de usuário único
    let finalUsername = username || email.split("@")[0];
    finalUsername = finalUsername.toLowerCase().replace(/[^a-z0-9_]/g, "");
    
    // Se o username já estiver em uso, acrescenta sufixo numérico
    const usernameExistente = await db.get("SELECT * FROM users WHERE username = ?", [finalUsername]);
    if (usernameExistente) {
      finalUsername = `${finalUsername}_${Math.floor(100 + Math.random() * 900)}`;
    }

    const userId = crypto.randomUUID();
    const hash = bcrypt.hashSync(senha, 10);
    
    // Insere usuário na tabela users
    await db.run(
      "INSERT INTO users (id, username, email, password_hash, bio) VALUES (?, ?, ?, ?, ?)",
      [userId, finalUsername, email, hash, "Cinéfilo apaixonado por histórias que nos transformam."]
    );

    // Insere o perfil padrão correspondente
    const profileId = crypto.randomUUID();
    await db.run(
      "INSERT INTO profiles (id, user_id, name) VALUES (?, ?, ?)",
      [profileId, userId, nome]
    );

    res.status(201).json({ mensagem: "Usuario criado com sucesso" });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;
  
  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  }

  try {
    const usuario = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!usuario || !bcrypt.compareSync(senha, usuario.password_hash)) {
      return res.status(401).json({ erro: "Email ou senha invalidos" });
    }
    
    const token = jwt.sign({ id: usuario.id }, "segredo123", { expiresIn: "1d" });
    res.json({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
};

const perfil = async (req, res) => {
  try {
    const usuario = await db.get("SELECT * FROM users WHERE id = ?", [req.usuarioId]);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuario nao encontrado" });
    }

    const perfilObj = await db.get("SELECT * FROM profiles WHERE user_id = ?", [req.usuarioId]);
    
    // Contagens de seguidores e seguindo
    const seguidoresRes = await db.get("SELECT COUNT(*) as qtd FROM follows WHERE followed_id = ?", [req.usuarioId]);
    const seguindoRes = await db.get("SELECT COUNT(*) as qtd FROM follows WHERE follower_id = ?", [req.usuarioId]);

    const seguidores = seguidoresRes ? seguidoresRes.qtd : 0;
    const seguindo = seguindoRes ? seguindoRes.qtd : 0;

    // Estatísticas adicionais do banco
    const avaliacoesRes = await db.get("SELECT COUNT(*) as qtd FROM ratings WHERE user_id = ?", [req.usuarioId]);
    const assistidosRes = await db.get("SELECT COUNT(*) as qtd FROM watched WHERE user_id = ?", [req.usuarioId]);
    const runtimeRes = await db.get("SELECT SUM(runtime) as total FROM watched WHERE user_id = ?", [req.usuarioId]);

    const avaliacoes = avaliacoesRes ? avaliacoesRes.qtd : 0;
    const filmesAssistidos = assistidosRes ? assistidosRes.qtd : 0;
    const horasAssistidas = runtimeRes && runtimeRes.total ? Math.round(runtimeRes.total / 60) : 0;

    // Média de Avaliação
    const mediaRes = await db.get("SELECT AVG(rating) as media FROM ratings WHERE user_id = ?", [req.usuarioId]);
    const mediaAvaliacao = mediaRes && mediaRes.media ? parseFloat(mediaRes.media.toFixed(1)) : 0;

    // Atividade Recente real integrada do banco
    const reviewsAtividade = await db.query(
      `SELECT 'Avaliador' as acao, r.movie_title as filme, r.comment as texto, rat.rating as estrelas, r.created_at as data 
       FROM reviews r
       LEFT JOIN ratings rat ON rat.user_id = r.user_id AND rat.movie_id = r.movie_id
       WHERE r.user_id = ?`,
      [req.usuarioId]
    );

    const watchedAtividade = await db.query(
      `SELECT 'Assistiu' as acao, movie_title as filme, '' as texto, 0 as estrelas, created_at as data 
       FROM watched 
       WHERE user_id = ?`,
      [req.usuarioId]
    );

    const listsAtividade = await db.query(
      `SELECT 'Adicionou' as acao, lm.movie_title as filme, l.name as texto, 0 as estrelas, lm.created_at as data 
       FROM list_movies lm 
       JOIN lists l ON l.id = lm.list_id 
       WHERE l.user_id = ?`,
      [req.usuarioId]
    );

    // Combina todas as atividades
    let atividadeRecente = [
      ...reviewsAtividade.map(r => ({
        id: `rev-${r.filme}-${r.data}`,
        acao: 'Avaliador',
        filme: r.filme,
        texto: r.texto,
        estrelas: r.estrelas,
        data: r.data
      })),
      ...watchedAtividade.map(w => ({
        id: `wat-${w.filme}-${w.data}`,
        acao: 'Assistiu',
        filme: w.filme,
        texto: "",
        estrelas: null,
        data: w.data
      })),
      ...listsAtividade.map(l => ({
        id: `lst-${l.filme}-${l.data}`,
        acao: `Adicionou à lista "${l.texto}"`,
        filme: l.filme,
        texto: "",
        estrelas: null,
        data: l.data
      }))
    ];

    // Ordena pela data mais recente
    atividadeRecente.sort((a, b) => new Date(b.data) - new Date(a.data));
    atividadeRecente = atividadeRecente.slice(0, 5); // Limita aos 5 mais recentes

    res.json({
      id: usuario.id,
      nome: perfilObj ? perfilObj.name : usuario.username,
      username: usuario.username,
      email: usuario.email,
      bio: usuario.bio,
      profile_id: perfilObj ? perfilObj.id : null,
      seguidores,
      seguindo,
      avaliacoes,
      filmesAssistidos,
      horasAssistidas,
      mediaAvaliacao,
      atividadeRecente,
      created_at: usuario.created_at
    });
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    res.status(500).json({ erro: "Erro ao carregar perfil" });
  }
};

const atualizarPerfil = async (req, res) => {
  const { nome, bio } = req.body;
  
  if (!nome) {
    return res.status(400).json({ erro: "O nome é obrigatório" });
  }

  try {
    // Atualiza a bio na tabela de usuários
    await db.run("UPDATE users SET bio = ? WHERE id = ?", [bio || "", req.usuarioId]);
    // Atualiza o nome na tabela de perfis
    await db.run("UPDATE profiles SET name = ? WHERE user_id = ?", [nome, req.usuarioId]);
    
    res.json({ mensagem: "Perfil atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ erro: "Erro ao atualizar perfil" });
  }
};

module.exports = { cadastrar, login, perfil, atualizarPerfil };
