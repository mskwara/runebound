const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/").get(userController.getAllUsers);

router.route("/signup").post(userController.signup);
router.route("/login").post(userController.login);
router.route("/isloggedin").get(userController.isLoggedIn);

router.route("/:userId").get(userController.getUser);

module.exports = router;
