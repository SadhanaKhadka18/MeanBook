const { error } = require('console');
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

const _sendResponse = function (status, message, res) {
    res.status(status).json(message);
}
const _jwtVerifyWithPromise = promisify(jwt.verify);

const validateToken = function (req, res, next) {
    const token = (req.headers.authorization).split(" ")[1];
    _jwtVerifyWithPromise(token, process.env.JWT_SECRET_KEY)
        .then(() => next())
        .catch((error) => _sendResponse(process.env.ERROR_STATUS_CODE, { "message": "Internal Server Error" }, res))
}

module.exports = { validateToken }