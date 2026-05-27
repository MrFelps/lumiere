const express = require("express");
const router = express.Router();
const { cadastrar, login, perfil } = require("../controllers/usuariosController");
const auth = require("../middleware/auth");

router.post("/cadastrar", cadastrar);
router.post("/login", login);
router.get("/perfil", auth, perfil);

module.exports = router;
