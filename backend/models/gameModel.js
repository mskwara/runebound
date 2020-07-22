const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    name: String,
    players: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
    round: {
        type: Number,
        default: 0,
    },
    currentPlay: {
        player: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        adventure: {
            skills: {
                bow: Number,
                sword: Number,
                magic: Number,
            },
            health: {
                maxHealth: Number,
                current: Number,
            },
        },
    },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
