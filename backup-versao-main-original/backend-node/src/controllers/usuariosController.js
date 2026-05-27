const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usuarios = [];

const cadastrar = (req, res) => {
  const { nome, email, senha } = req.body;
  if (usuarios.find(u => u.email === email))
    return res.status(400).json({ erro: "Email ja cadastrado" });
  const hash = bcrypt.hashSync(senha, 10);
  const usuario = { id: Date.now(), nome, email, senha: hash };
  usuarios.push(usuario);
  res.status(201).json({ mensagem: "Usuario criado com sucesso" });
};

const login = (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario || !bcrypt.compareSync(senha, usuario.senha))
    return res.status(401).json({ erro: "Email ou senha invalidos" });
  const token = jwt.sign({ id: usuario.id }, "segredo123", { expiresIn: "1d" });
  res.json({ token });
};

const perfil = (req, res) => {
  const usuario = usuarios.find(u => u.id === req.usuarioId);
  if (!usuario) return res.status(404).json({ erro: "Usuario nao encontrado" });
  res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
};

module.exports = { cadastrar, login, perfil };
