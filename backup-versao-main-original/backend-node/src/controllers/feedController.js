const opinioes = [
  { id: 1, usuarioId: 1, usuario: "Joao", filme: "Oppenheimer", opiniao: "Incrivel!", data: "2024-01-15" },
  { id: 2, usuarioId: 2, usuario: "Maria", filme: "Duna 2", opiniao: "Muito bom!", data: "2024-02-10" }
];

const usuarios = [
  { id: 1, nome: "Joao", email: "joao@email.com" },
  { id: 2, nome: "Maria", email: "maria@email.com" }
];

const listarOpinioes = (req, res) => {
  res.json(opinioes);
};

const buscarUsuarios = (req, res) => {
  const { nome } = req.query;
  if (!nome) return res.json(usuarios);
  const resultado = usuarios.filter(u =>
    u.nome.toLowerCase().includes(nome.toLowerCase())
  );
  res.json(resultado);
};

module.exports = { listarOpinioes, buscarUsuarios };
