const { log, error } = require("console");
const mongoose = require("mongoose");
const Book = mongoose.model(process.env.BOOK_MODEL);

const _createResponse = function () {
    const response = { status: parseInt(process.env.SUCCESS_STATUS_CODE, process.env.BASE_DECIMAL), message: [] };
    return response;
}
const _setResponse = function (response, status, message) {
    response.status = parseInt(status, process.env.BASE_DECIMAL);
    response.message = message;
}
const _sendResponse = function (response, res) {
    res.status(response.status).json(response.message);
}

const _addAuthor = function (req, res, addedBook) {
    const newAuthors = req.body.authors;
    const response = _createResponse();
    Book.updateOne({ _id: addedBook.id }, { $push: { authors: newAuthors } })
        .then(function (addAuthorAcknowledgement) {
            console.log(addAuthorAcknowledgement);
            _setResponse(response, process.env.SUCCESS_STATUS_CODE, { "added author acknowledged": addAuthorAcknowledgement.acknowledged });
        })
        .catch(function (err) {
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
        })
        .finally(function () {
            _sendResponse(response, res);
        });
}

const getAllAuthors = function (req, res) {
    console.log("get authors request");
    const bookId = req.params.bookId;
    let offset = parseInt(process.env.DEFAULT_FIND_OFFSET, process.env.BASE_DECIMAL);
    let count = parseInt(process.env.DEFAULT_FIND_COUNT, process.env.BASE_DECIMAL);
    const maxCount = parseInt(process.env.DEFAULT_MAX_FIND_LIMIT, process.env.BASE_DECIMAL);

    const response = _createResponse();

    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, process.env.BASE_DECIMAL);
    }
    if (req.query && req.query.count) {
        count = parseInt(req.query.count, process.env.BASE_DECIMAL);
    }
    if (isNaN(offset) || isNaN(count)) {
        _setResponse(response, process.env.INPUT_ERROR, { "message": process.env.QUERY_OFFSET_TYPEE_MISMATCH_MESSGAE });
        _sendResponse(response, res);
        return;
    };

    if (count > maxCount) {
        _setResponse(response, process.env.INPUT_ERROR, { "message": process.env.EXCEED_MAX_COUNT_MESSAGE + maxCount });
        _sendResponse(response, res);
        return;
    } else {
        Book.findById(bookId).select("authors").skip(offset).limit(count).exec()
            .then(function (book) {
                if (!book) {
                    _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.BOOK_NOT_FOUND_MESSAGE });
                } else if (!book.authors) {
                    _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.AUTHOR_OF_BOOK_NOT_FOUND_MESSAGE });
                } else {
                    _setResponse(response, process.env.SUCCESS_STATUS_CODE, book.author);
                }
            })
            .catch(function (err) {
                _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
            })
            .finally(function () {
                _sendResponse(response, res);
            });
    }
}

const addAuthors = function (req, res) {
    console.log("add author request");
    const bookId = req.params.bookId;
    const response = _createResponse();

    Book.findById(bookId).select("authors").exec()
        .then(function (addedBook) {
            if (!addedBook) {
                _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.BOOK_NOT_FOUND_MESSAGE });
            } else {
                _addAuthor(req, res, addedBook);
            }
        })
        .catch(function (err) {
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
        })
        .finally(function () {
            if (response.status != process.env.SUCCESS_STATUS_CODE) {
                _sendResponse(response, res);
            }
        });
}

const getOneAuthor = function (req, res) {
    console.log("get one author request");
    const bookId = req.params.bookId;
    const authorId = req.params.authorId;
    const response = _createResponse();
    Book.findById(bookId).select("authors").exec()
        .then(function (book) {
            if (!book) {
                _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.BOOK_NOT_FOUND_MESSAGE });
            } else if (!book.authors) {
                _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.AUTHOR_OF_BOOK_NOT_FOUND_MESSAGE });
            } else if (!book.authors.id(authorId)) {
                _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.AUTHOR_ID_BOOK_NOT_FOUND_MESSAGE });
            } else {
                _setResponse(response, process.env.SUCCESS_STATUS_CODE, book.authors.id(authorId));
            }
        })
        .catch(function (err) {
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
        })
        .finally(function () {
            _sendResponse(response, res);
        });
}

const deleteOneAuthor = function (req, res) {
    console.log("delete one author request");
    const bookId = req.params.bookId;
    const authorId = req.params.authorId;
    const response = _createResponse();

    Book.updateOne({ _id: bookId }, { $pull: { authors: { _id: authorId } } })
        .then(function (deleteAcknowlegement) {
            _setResponse(response, process.env.SUCCESS_STATUS_CODE, { "delete acknowledgement": deleteAcknowlegement.acknowledged });
        })
        .catch(function (err) {
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
        })
        .finally(function () {
            _sendResponse(response, res);
        })
}

const _updateOne = function (req, res, authorUpdateCallback) {
    console.log("update One author Controller")
    const bookId = req.params.bookId;
    const authorId = req.params.authorId;
    const response = _createResponse();
    Book.findById(bookId).select("authors")
        .then(function (book) {
            if (!book) {
                _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.BOOK_NOT_FOUND_MESSAGE });
            } else if (!book.authors) {
                _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.AUTHOR_OF_BOOK_NOT_FOUND_MESSAGE });
            } else if (!book.authors.id(authorId)) {
                _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.AUTHOR_ID_BOOK_NOT_FOUND_MESSAGE });
            } else {
                console.log("modified successfully");
                modifiedAuthor = book.authors.id(authorId);
                authorUpdateCallback(req, res, modifiedAuthor);
            }
        })
        .catch(function (err) {
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
        })
        .finally(function () {
            if (response.status != parseInt(process.env.SUCCESS_STATUS_CODE, process.env.BASE_DECIMAL)) {
                _sendResponse(response, res);
            }
        });
}

const _partialAuthorUpdate = function (req, res, modifiedAuthor) {
    const bookId = req.params.bookId;
    const authorId = req.params.authorId;

    if (req.body && req.body.name) {
        modifiedAuthor.name = req.body.name;
    }
    if (req.body && req.body.description) {
        modifiedAuthor.description = req.body.description;
    }
    if (req.body && req.body.location) {
        modifiedAuthor.location = req.body.location;
    }

    const response = _createResponse();

    Book.updateOne({ "_id": bookId, "authors._id": authorId }, {
        $set: {
            "authors.$": modifiedAuthor
        }
    })
        .then(function (authorAck) {
            _setResponse(response, process.env.SUCCESS_STATUS_CODE, { "updated author partially acknowledgement": authorAck.acknowledged });
        })
        .catch(function (err) {
            console.log("Error updating  author of book", err);
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
        })
        .finally(function () {
            _sendResponse(response, res);
        });
}

const _fullAuthorUpdate = function (req, res, modifiedAuthor) {
    const bookId = req.params.bookId;
    const authorId = req.params.authorId;

    modifiedAuthor.name = req.body.name;
    modifiedAuthor.description = req.body.description;
    modifiedAuthor.location = req.body.location;

    const response = _createResponse();

    Book.updateOne({ "_id": bookId, "authors._id": authorId }, {
        $set: {
            "authors.$": modifiedAuthor
        }
    })
        .then(function (authorAck) {
            _setResponse(response, process.env.SUCCESS_STATUS_CODE, { "updated author fully acknowledgement": authorAck.acknowledged });
        })
        .catch(function (err) {
            console.log("Error updating  author of book", err);
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
        })
        .finally(function () {
            _sendResponse(response, res);
        });
}

const partialUpdateOneAuthor = function (req, res) {
    console.log("partial update one author request");
    _updateOne(req, res, _partialAuthorUpdate);
}

const fullUpdateOneAuthor = function (req, res) {
    console.log("full update one author request");
    _updateOne(req, res, _fullAuthorUpdate);
}

module.exports = {
    getAllAuthors,
    addAuthors,
    getOneAuthor,
    deleteOneAuthor,
    partialUpdateOneAuthor,
    fullUpdateOneAuthor
}