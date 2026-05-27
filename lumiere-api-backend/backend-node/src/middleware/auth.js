const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ erro: "Token nao fornecido" });
  try {
    const decoded = jwt.verify(token, "segredo123");
    req.usuarioId = decoded.id;
    next();
  } catch {
    res.status(401).json({ erro: "Token invalido" });
  }
};

module.exports = auth;
