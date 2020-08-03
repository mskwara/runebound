const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    name: String,
    players: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
            accepted: {
                type: Boolean,
                default: false,
            },
        },
    ],
    round: {
        type: Number,
        default: 0,
    },
    map: [
        {
            terrain: String,
            isCity: {
                type: Boolean,
                default: false,
            },
            city: Number,
            isAdventure: {
                type: Boolean,
                default: false,
            },
            adventure: {
                id: Number,
                difficulty: Number,
            },
        },
    ],
    currentPlay: {
        player: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["dices", "move", "adventure", "city"],
            default: "dices",
        },
        dicesResult: [Object],
        adventure: {
            skills: {
                archery: Number,
                sword: Number,
                magic: Number,
            },
            health: {
                maxHealth: Number,
                current: Number,
            },
        },
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

gameSchema.pre(/^find/, function (next) {
    this.populate({
        path: "players.user",
        select: "nick games",
    });
    // .populate({
    //     path: "currentPlay.player",
    //     select: "nick",
    // });
    next();
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
