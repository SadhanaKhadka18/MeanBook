const express = require("express");
const router = express.Router();
const booksRouter = require("../books/books.routes");
const usersRouter = require("../users/users.routes");

router.use("/books", booksRouter);
router.use("/users", usersRouter);

module.exports = router;