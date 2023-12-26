const express = require("express");
const router = express.Router();
const userController = require("./users.controller");

router.route("/")
    .post(userController.addOne);
router.route("/login")
    .post(userController.getOne);

module.exports = router;