const express = require("express");
const gameController = require("../controllers/gameController");

const router = express.Router();

router
    .route("/")
    .get(gameController.getAllGames)
    .post(gameController.createGame);

router.route("/:gameId").get(gameController.getGame);
router.route("/:gameId/users").get(gameController.getUsersPlayingGame);
router.route("/:gameId/user/:userId/accept").post(gameController.acceptGame);
router.route("/:gameId/setDices").post(gameController.setDices);
router
    .route("/:gameId/user/:userId/move")
    .post(gameController.moveToChosenField);
router
    .route("/:gameId/user/:userId/updatePlayer")
    .patch(gameController.updatePlayer);

router.route("/user/:id").get(gameController.getUserGames);

router.route("/:gameId").delete(gameController.deleteGame);

module.exports = router;
