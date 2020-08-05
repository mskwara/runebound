const Game = require("../models/gameModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllGames = catchAsync(async (req, res, next) => {
    const games = await Game.find()
        .populate({ path: "players.user", select: "nick" })
        .select("-map")
        .sort({ createdAt: "-1" });

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
    const games = await Game.find({ _id: { $in: gameIds } })
        .populate({ path: "players.user", select: "nick" })
        .select("-map")
        .sort({ createdAt: "-1" });

    res.status(200).json({
        status: "success",
        results: games.length,
        data: {
            games,
        },
    });
});

const getGame = async (gameId) => {
    let game = await Game.findById(gameId)
        .populate({ path: "players.user", select: "nick games" })
        .lean();
    console.log(game.players[0].user);
    return transformGamePlayers(game, gameId);
};

const transformGamePlayers = (game, gameId) => {
    game.players = game.players.map((player) => {
        const hisGames = player.user.games;
        player.user.games = undefined;
        // console.log("hg", hisGames);
        const currentGame = hisGames.filter((game) => {
            return game.game == gameId;
        })[0];
        // console.log(currentGame);
        player.character = currentGame.player;
        return player;
    });
    return game;
};

exports.getGame = catchAsync(async (req, res, next) => {
    const game = await getGame(req.params.gameId);

    res.status(200).json({
        status: "success",
        data: {
            game,
        },
    });
});

exports.createGame = catchAsync(async (req, res, next) => {
    const game = await Game.create(req.body);
    const playerIds = req.body.players.map((el) => el.user);
    const users = await User.updateMany(
        { _id: { $in: playerIds } },
        {
            $push: {
                games: {
                    game: game._id,
                },
            },
        }
    );

    res.status(200).json({
        status: "success",
        data: {
            game,
            users,
        },
    });
});

exports.deleteGame = catchAsync(async (req, res, next) => {
    const players = (await Game.findById(req.params.gameId)).players;
    await Game.findByIdAndDelete(req.params.gameId);
    players.forEach(async (player) => {
        const userId = player.user._id;
        await User.findByIdAndUpdate(userId, {
            $pull: {
                games: { game: req.params.gameId },
            },
        });
    });

    res.status(200).json({
        status: "success",
    });
});

exports.acceptGame = catchAsync(async (req, res, next) => {
    // set player.accepted in game data
    const game = await Game.findById(req.params.gameId);
    const players = game.players;

    let allAccepted = true;
    for (let i = 0; i < players.length; i++) {
        if (players[i].user._id == req.params.userId) {
            players[i].accepted = true;
        }
        if (!players[i].accepted) {
            allAccepted = false;
        }
    }
    await Game.findByIdAndUpdate(
        { _id: req.params.gameId },
        {
            players,
        }
    );

    if (allAccepted) {
        await Game.findByIdAndUpdate(
            { _id: req.params.gameId },
            {
                $inc: { round: 1 },
                currentPlay: {
                    player: players[0].user._id,
                    status: "dices",
                    dicesResult: [],
                },
            }
        );
    }

    const user = await User.findOneAndUpdate(
        { _id: req.params.userId, "games.game": req.params.gameId },
        {
            $set: {
                "games.$.player": {
                    avatar: req.body.avatar,
                    money: 3,
                    items: [],
                    skills: {
                        archery: req.body.archery,
                        sword: req.body.sword,
                        magic: req.body.magic,
                    },
                    health: {
                        maxHealth: req.body.health,
                        current: req.body.health,
                    },
                    position: {
                        x: req.body.position.x,
                        y: req.body.position.y,
                    },
                },
            },
        },
        { new: true }
    );

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

exports.setDices = catchAsync(async (req, res, next) => {
    let game = await Game.findByIdAndUpdate(
        req.params.gameId,
        {
            $set: {
                "currentPlay.dicesResult": req.body.dicesResult,
                "currentPlay.status": req.body.status,
            },
        },
        { new: true }
    )
        .populate({ path: "players.user", select: "nick games" })
        .lean();

    game = transformGamePlayers(game, req.params.gameId);

    res.status(200).json({
        status: "success",
        data: {
            game,
        },
    });
});

const finishPlayerTurn = async (gameId, userId, status) => {
    const game = await Game.findById(gameId);
    const currentPlayer = game.players.filter((p) => p.user._id == userId)[0];
    let nextPlayerIndex = game.players.indexOf(currentPlayer) + 1;
    if (nextPlayerIndex == game.players.length) {
        nextPlayerIndex = 0;
    }
    const nextPlayerId = game.players[nextPlayerIndex].user._id;

    const updGame = await Game.findByIdAndUpdate(
        gameId,
        {
            $set: {
                "currentPlay.player": nextPlayerId,
                "currentPlay.dicesResult": [],
                "currentPlay.status": status,
            },
        },
        { new: true }
    )
        .populate({ path: "players.user", select: "nick games" })
        .lean();

    return updGame;
};

exports.moveToChosenField = catchAsync(async (req, res, next) => {
    //update user
    const user = await User.findById(req.params.userId);
    let hisGames = user.games;
    const currentGame = hisGames.filter((g) => g.game == req.params.gameId)[0];
    const index = hisGames.indexOf(currentGame);
    currentGame.player.position = {
        x: req.body.x,
        y: req.body.y,
    };
    hisGames[index] = currentGame;
    const updUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
            $set: {
                games: hisGames,
            },
        },
        { new: true }
    );

    // update game
    let updGame = null;
    if (req.body.status === "dices") {
        // kolejka następnego gracza
        updGame = await finishPlayerTurn(
            req.params.gameId,
            req.params.userId,
            req.body.status
        );
    } else {
        updGame = await Game.findByIdAndUpdate(
            // dla city i adventure
            req.params.gameId,
            {
                $set: {
                    "currentPlay.dicesResult": [],
                    "currentPlay.status": req.body.status,
                },
            },
            { new: true }
        )
            .populate({ path: "players.user", select: "nick games" })
            .lean();

        if (req.body.status === "city" && req.body.itemId != null) {
            // doszedł do miasta
            await Game.findOneAndUpdate(
                // add item to city
                { _id: req.params.gameId, "cities.cityId": req.body.cityId },
                {
                    $push: {
                        "cities.$.items": req.body.itemId,
                    },
                }
            );
            updGame = await Game.findOneAndUpdate(
                // remove item from available items
                { _id: req.params.gameId },
                {
                    $pull: {
                        availableItems: req.body.itemId,
                    },
                },
                { new: true }
            )
                .populate({ path: "players.user", select: "nick games" })
                .lean();
        } else if (req.body.status === "adventure") {
            // doszedł do przygody
            // updGame = await Game.findByIdAndUpdate(
            //     req.params.gameId,
            //     {
            //         $set: {
            //             "currentPlay.dicesResult": [],
            //             "currentPlay.status": req.body.status,
            //         },
            //     },
            //     { new: true }
            // )
            //     .populate({ path: "players.user", select: "nick games" })
            //     .lean();
        }
    }
    updGame = transformGamePlayers(updGame, req.params.gameId);

    res.status(200).json({
        status: "success",
        data: {
            game: updGame,
            user: updUser,
        },
    });
});

exports.buyItem = catchAsync(async (req, res, next) => {
    let game = await Game.findOneAndUpdate(
        // remove item from city
        { _id: req.params.gameId, "cities.cityId": req.body.cityId },
        {
            $pull: {
                "cities.$.items": req.body.itemId,
            },
        },
        { new: true }
    )
        .populate({ path: "players.user", select: "nick games" })
        .lean();

    const user = await User.findOneAndUpdate(
        // add item to player
        { _id: req.params.userId, "games.game": req.params.gameId },
        {
            $push: {
                "games.$.player.items": req.body.itemId,
            },
            $inc: {
                "games.$.player.money": -req.body.price,
            },
        },
        { new: true }
    );

    game = transformGamePlayers(game, req.params.gameId);

    res.status(200).json({
        status: "success",
        data: {
            game,
            user,
        },
    });
});

exports.finishPlayerTurn = catchAsync(async (req, res, next) => {
    const game = await finishPlayerTurn(
        req.params.gameId,
        req.params.userId,
        req.body.status
    );

    res.status(200).json({
        status: "success",
        data: {
            gameStatus: game.currentPlay.status,
        },
    });
});

exports.updatePlayer = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        { _id: req.params.userId, "games.game": req.params.gameId },
        req.body.update
    ).select("-password");

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});
