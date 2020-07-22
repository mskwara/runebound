const Game = require("../models/gameModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllGames = catchAsync(async (req, res, next) => {
    const games = await Game.find();

    res.status(200).json({
        status: "success",
        results: games.length,
        data: {
            games,
        },
    });
});

exports.createGame = catchAsync(async (req, res, next) => {
    const game = await Game.create(req.body);

    res.status(200).json({
        status: "success",
        data: {
            game,
        },
    });
});
