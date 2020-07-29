const Game = require("../models/gameModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllGames = catchAsync(async (req, res, next) => {
    const games = await Game.find().select("-map");

    res.status(200).json({
        status: "success",
        results: games.length,
        data: {
            games,
        },
    });
});

exports.getUserGames = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    const gameIds = user.games.map((el) => el.game);
    const games = await Game.find({ _id: { $in: gameIds } });

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
    const playerIds = req.body.players.map((el) => el.user);
    const users = await User.update(
        { _id: { $in: playerIds } },
        {
            $push: {
                games: {
                    game: game._id,
                },
            },
        },
        { multi: true }
    );

    res.status(200).json({
        status: "success",
        data: {
            game,
            users,
        },
    });
});
