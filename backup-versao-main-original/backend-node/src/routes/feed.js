const express = require("express");
const router = express.Router();
const { listarOpinioes, buscarUsuarios } = require("../controllers/feedController");
const auth = require("../middleware/auth");

router.get("/opinioes", auth, listarOpinioes);
router.get("/buscar", auth, buscarUsuarios);

module.exports = router;
