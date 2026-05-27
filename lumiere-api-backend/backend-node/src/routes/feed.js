const express = require("express");
const router = express.Router();
const {
  listarOpinioes,
  buscarUsuarios,
  postarOpiniao,
  avaliarFilme,
  criarLista,
  adicionarFilmeLista,
  obterListasUsuario
} = require("../controllers/feedController");
const auth = require("../middleware/auth");

router.get("/opinioes", auth, listarOpinioes);
router.get("/buscar", auth, buscarUsuarios);
router.post("/opiniao", auth, postarOpiniao);

// Rotas de Avaliações e Listas Persistentes
router.post("/avaliar", auth, avaliarFilme);
router.post("/listas", auth, criarLista);
router.post("/listas/adicionar", auth, adicionarFilmeLista);
router.get("/listas", auth, obterListasUsuario);

module.exports = router;
