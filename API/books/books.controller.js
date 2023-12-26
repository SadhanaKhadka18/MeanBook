const { log } = require("console");
const mongoose = require("mongoose");
const { off } = require("process");
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


const _runGeoQuery = function (req, res, offset, count) {
    const lng = parseFloat(req.query.lng, process.env.BASE_DECIMAL);
    const lat = parseFloat(req.query.lat, process.env.BASE_DECIMAL);
    let max = parseFloat(process.env.GEO_SEARCH_MAX_DIST, process.env.BASE_DECIMAL)
    if (req.query && req.query.max) {
        max = parseInt(req.query.max, process.env.BASE_DECIMAL);
    }
    const response = _createResponse();
    //Geo Json Point
    const point = { type: "Point", coordinates: [lng, lat] };
    const query = {
        "authors.location.coordinates": {
            $near: {
                $geometry: point,
                $minDistance: parseFloat(process.env.GEO_SEARCH_MIN_DIST, process.env.BASE_DECIMAL),
                $maxDistance: max
            }
        }
    }
    Book.find(query).skip(offset).limit(count).exec()
        .then(function (books) {
            if (!books) {
                console.log("No Books added");
                _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.NO_BOOKS_ADDED_MESSAG });
            } else {
                _setResponse(response, process.env.SUCCESS_STATUS_CODE, books);
            }
        })
        .catch(function (err) {
            console.log("Error getting all books");
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
        })
        .finally(function () {
            _sendResponse(response, res);
        });
}

const getAll = function (req, res) {
    console.log("Get All books recieved");
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
    } if (req.query && req.query.lat && req.query.lng) {
        _runGeoQuery(req, res, offset, count);
        return;
    } else {
        Book.find().skip(offset).limit(count).exec()
            .then(function (books) {
                if (!books) {
                    console.log("No Books added");
                    _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.NO_BOOKS_ADDED_MESSAGE });
                } else {
                    _setResponse(response, process.env.SUCCESS_STATUS_CODE, books);
                }
            })
            .catch(function (err) {
                console.log("Error getting all books");
                _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
            })
            .finally(function () {
                _sendResponse(response, res)
            });
    }
}

const addOne = function (req, res) {
    console.log("Add One Book request");
    const response = _createResponse();
    const newBook = {
        "title": req.body.title, "noOfPages": req.body.noOfPages, "publisherName": req.body.publisherName,
        "year": req.body.year, "authors": req.body.authors
    };

    Book.create(newBook)
        .then(function (addedBook) {
            _setResponse(response, process.env.SUCCESS_STATUS_CODE, addedBook);
        })
        .catch(function (err) {
            console.log("Error adding  book");
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
        })
        .finally(function () {
            _sendResponse(response, res);
        });
}

const getOne = function (req, res) {
    console.log("get one book request");
    const bookId = req.params.bookId;
    const response = _createResponse();
    Book.findById(bookId).exec()
        .then(function (book) {
            if (!book) {
                console.log("No book found");
                _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.BOOK_NOT_FOUND_MESSAGE });
            } else {
                _setResponse(response, process.env.SUCCESS_STATUS_CODE, book);
            }
        })
        .catch(function (err) {
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
        })
        .finally(function () {
            _sendResponse(response, res);
        });
}

const deleteOne = function (req, res) {
    const bookId = req.params.bookId;
    const response = _createResponse();
    console.log("delete one book request");
    Book.findByIdAndDelete(bookId).exec()
        .then(function (deletedBook) {
            if (!deletedBook) {
                _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.BOOK_NOT_FOUND_MESSAGE });
            } else {
                _setResponse(response, process.env.SUCCESS_STATUS_CODE, deletedBook);
            }
        })
        .catch(function (err) {
            console.log("Error deleting  book");
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });

        })
        .finally(function (err) {
            _sendResponse(response, res);
        });
}

const _updateOne = function (req, res, bookUpdateCallback) {
    console.log("update One book Controller");

    const bookId = req.params.bookId;
    const response = _createResponse();

    Book.findById(bookId).exec()
        .then(function (foundBook) {
            if (!foundBook) {
                console.log("No book found with the id to update");
                _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.BOOK_NOT_FOUND_MESSAGE });
            } else {
                bookUpdateCallback(req, res, foundBook);
            }
        })
        .catch(function (err) {
            console.log(err);
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
        })
        .finally(function () {
            if (response.status != process.env.SUCCESS_STATUS_CODE) {
                _sendResponse(response, res);
            }
        });
}

const _partialBookUpdate = function (req, res, book) {
    if (req.body.title) {
        book.title = req.body.title;
    }
    if (req.body.noOfPages) {
        book.noOfPages = req.body.noOfPages;
    }
    if (req.body.publisherName) {
        book.publisherName = req.body.publisherName;
    }
    if (req.body.year) {
        book.year = req.body.year;
    }
    if (req.body.authors) {
        book.authors = req.body.authors;
    }
    const response = _createResponse();
    book.save()
        .then(function (updatedBook) {
            if (!updatedBook) {
                console.log("No book found with the id to update");
                _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.BOOK_NOT_FOUND_MESSAGE });
            } else {
                _setResponse(response, process.env.SUCCESS_STATUS_CODE, updatedBook);
            }
        })
        .catch(function (err) {
            console.log(err);
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
        })
        .finally(function () {
            _sendResponse(response, res);
        });
}

const _fullBookUpdate = function (req, res, book) {
    book.title = req.body.title;
    book.noOfPages = req.body.noOfPages;
    book.year = req.body.year;
    book.publisherName = req.body.publisherName;
    book.authors = req.body.authors;

    const response = _createResponse();

    book.save()
        .then(function (updatedBook) {
            if (!updatedBook) {
                console.log("No book found with the id to update");
                _setResponse(response, process.env.NOT_FOUND_STATUS_CODE, { "message": process.env.BOOK_NOT_FOUND_MESSAGE });
            } else {
                _setResponse(response, process.env.SUCCESS_STATUS_CODE, updatedBook);
            }
        })
        .catch(function (err) {
            console.log(err);
            _setResponse(response, process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" });
        })
        .finally(function () {
            _sendResponse(response, res);
        });
}

const partialUpdateOne = function (req, res) {
    console.log(" partial update request recieved");
    _updateOne(req, res, _partialBookUpdate);
}

const fullUpdateOne = function (req, res) {
    console.log(" full update request recieved");
    _updateOne(req, res, _fullBookUpdate);
}


module.exports = { getAll, addOne, getOne, deleteOne, partialUpdateOne, fullUpdateOne }