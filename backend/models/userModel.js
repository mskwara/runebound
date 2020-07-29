const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    nick: {
        type: String,
        required: [true, "User must have a nick!"],
    },
    email: {
        type: String,
        required: [true, "User must have an email!"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "User must have a password!"],
        minlength: 6,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not the same!",
        },
    },
    games: [
        {
            game: {
                type: mongoose.Schema.ObjectId,
                ref: "Game",
            },
            player: {
                avatar: String,
                money: Number,
                items: [Number],
                skills: {
                    bow: Number,
                    sword: Number,
                    magic: Number,
                },
                health: {
                    maxHealth: Number,
                    current: Number,
                },
                position: {
                    x: Number,
                    y: Number,
                },
            },
        },
    ],
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
