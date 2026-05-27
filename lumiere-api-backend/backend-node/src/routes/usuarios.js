const express = require("express");
const router = express.Router();
const { cadastrar, login, perfil, atualizarPerfil } = require("../controllers/usuariosController");
const auth = require("../middleware/auth");

router.post("/cadastrar", cadastrar);
router.post("/login", login);
router.get("/perfil", auth, perfil);
router.put("/perfil", auth, atualizarPerfil);

module.exports = router;
