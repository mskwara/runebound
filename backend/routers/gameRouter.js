const express = require("express");
const gameController = require("../controllers/gameController");

const router = express.Router();

router
    .route("/")
    .get(gameController.getAllGames)
    .post(gameController.createGame);

router.route("/user/:id").get(gameController.getUserGames);

module.exports = router;
