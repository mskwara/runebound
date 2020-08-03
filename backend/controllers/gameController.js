const Game = require("../models/gameModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllGames = catchAsync(async (req, res, next) => {
    const games = await Game.find().select("-map").sort({ createdAt: "-1" });
    console.log(games);

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
    let game = await Game.findById(gameId).lean();

    return transformGamePlayers(game, gameId);
};

const transformGamePlayers = (game, gameId) => {
    game.players = game.players.map((player) => {
        const hisGames = player.user.games;
        player.user.games = undefined;
        const currentGame = hisGames.filter((game) => game.game == gameId)[0];
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

exports.getUsersPlayingGame = catchAsync(async (req, res, next) => {
    const userIds = (await Game.findById(req.params.gameId)).players.map(
        (p) => p.user._id
    );
    let users = await User.find({ _id: { $in: userIds } }).select("-password");
    users = users.map((user) => {
        const currentGame = user.games.find(
            (game) => game.game == req.params.gameId
        );
        return {
            _id: user._id,
            nick: user.nick,
            player: currentGame.player,
        };
    });

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
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
    ).lean();

    game = transformGamePlayers(game, req.params.gameId);

    res.status(200).json({
        status: "success",
        data: {
            game,
        },
    });
});

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
        const game = await Game.findById(req.params.gameId);
        const currentPlayer = game.players.filter(
            (p) => p.user._id == req.params.userId
        )[0];
        let nextPlayerIndex = game.players.indexOf(currentPlayer) + 1;
        if (nextPlayerIndex == game.players.length) {
            nextPlayerIndex = 0;
        }
        const nextPlayerId = game.players[nextPlayerIndex].user._id;

        updGame = await Game.findByIdAndUpdate(
            req.params.gameId,
            {
                $set: {
                    "currentPlay.player": nextPlayerId,
                    "currentPlay.dicesResult": [],
                    "currentPlay.status": req.body.status,
                },
            },
            { new: true }
        ).lean();
    } else {
        updGame = await Game.findByIdAndUpdate(
            req.params.gameId,
            {
                $set: {
                    "currentPlay.dicesResult": [],
                    "currentPlay.status": req.body.status,
                },
            },
            { new: true }
        ).lean();
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
