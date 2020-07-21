const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
});

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        nick: req.body.nick,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const cookieOptions = {
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    };

    res.cookie("jwt", token, cookieOptions);

    res.status(201).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
});
