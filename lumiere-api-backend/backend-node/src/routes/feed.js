const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/feedController");
const auth = require("../middleware/auth");

router.get("/opinioes", auth, listarOpinioes);
router.get("/buscar", auth, buscarUsuarios);
router.post("/opiniao", auth, postarOpiniao);

// Rotas de Avaliações, Listas Persistentes e Social
router.post("/avaliar", auth, avaliarFilme);
router.post("/listas", auth, criarLista);
router.post("/listas/adicionar", auth, adicionarFilmeLista);
router.post("/listas/remover", auth, removerFilmeLista);
router.get("/listas", auth, obterListasUsuario);
router.get("/listas/:id", auth, obterDetalhesLista);
router.post("/seguir", auth, seguirUsuario);
router.post("/assistidos", auth, toggleAssistido);
router.get("/assistidos/checar", auth, obterEstadoAssistido);
router.get("/opinioes/filme/:movie_id", auth, obterOpinioesFilme);

module.exports = router;
