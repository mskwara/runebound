const express = require("express");
const gameController = require("../controllers/gameController");

const router = express.Router();

router
    .route("/")
    .get(gameController.getAllGames)
    .post(gameController.createGame);

router.route("/:gameId").get(gameController.getGame);
router.route("/:gameId/user/:userId/accept").post(gameController.acceptGame);

router.route("/user/:id").get(gameController.getUserGames);

router.route("/:gameId").delete(gameController.deleteGame);

module.exports = router;
