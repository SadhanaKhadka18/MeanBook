const express = require("express");
const router = express.Router();
const booksController = require("../books/books.controller");
const authorsController = require("../authors/authors.controller");
const authenticationController = require("../authentication/authentication.controller");

router.route("/")
    .get(booksController.getAll)
    .post(authenticationController.validateToken, booksController.addOne);

router.route("/:bookId")
    .get(booksController.getOne)
    .delete(authenticationController.validateToken, booksController.deleteOne)
    .patch(authenticationController.validateToken, booksController.partialUpdateOne)
    .put(authenticationController.validateToken, booksController.fullUpdateOne);


router.route("/:bookId/authors")
    .get(authorsController.getAllAuthors)
    .post(authenticationController.validateToken, authorsController.addAuthors);


router.route("/:bookId/authors/:authorId")
    .get(authorsController.getOneAuthor)
    .delete(authenticationController.validateToken, authorsController.deleteOneAuthor)
    .patch(authenticationController.validateToken, authorsController.partialUpdateOneAuthor)
    .put(authenticationController.validateToken, authorsController.fullUpdateOneAuthor);


module.exports = router;