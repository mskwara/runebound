const express = require("express");
const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routers/userRouter");
const app = express();

app.use(cors());
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

app.options("*", cors());

app.use(express.json({ limit: "10kb" }));

// app.use(cookieParser());

// ROUTES

app.use("/api/users", userRouter);

// app.use(globalErrorHandler);

module.exports = app;
