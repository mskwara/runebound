const mongoose = require("mongoose");

const gamerSchema = new mongoose.Schema({
    players: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
    round: Number,
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
