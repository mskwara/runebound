const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find().select("-password -email");

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId).select("-password");

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

const createSendToken = (user, statusCode, req, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: `${process.env.JWT_COOKIE_EXPIRES_IN}d`,
    });
    const cookieOptions = {
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
    };

    res.cookie("jwt", token, cookieOptions);

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        nick: req.body.nick,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(user, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { nick, password } = req.body;

    if (!nick || !password) {
        return next(new Error("Please provide nick and password!"));
    }

    const user = await User.findOne({ nick });

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new Error("Wrong nick or password!"));
    }

    createSendToken(user, 200, req, res);
});

exports.isLoggedIn = async (req, res, next) => {
    try {
        if (req.cookies.jwt) {
            console.log("jest jwt");
            // 1) verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id).select(
                "-password"
            );
            if (!currentUser) {
                return res.status(200).json({
                    status: "fail",
                    data: {
                        user: null,
                    },
                });
            }

            // THERE IS A LOGGED IN USER
            return res.status(200).json({
                status: "success",
                data: {
                    user: currentUser,
                },
            });
        }
        return res.status(200).json({
            status: "fail",
            data: {
                user: null,
            },
        });
    } catch (err) {
        return res.status(200).json({
            status: "fail",
            data: {
                user: null,
            },
        });
    }
};
