const express = require("express");
const app = express();
require("dotenv").config();
require("./API/data/db")
const path = require("path");
const routes = require("./API/routes");

app.set("port", process.env.PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH,PUT');
    res.header('Access-Control-Allow-Headers', 'Content-Type,authorization')
    next();
})

app.use(express.static(path.join(__dirname, process.env.PUBLIC_FOLDER)));
app.use("/api/", routes);

app.use(function (req, res) {
    res.sendFile(path.join(__dirname, process.env.PUBLIC_FOLDER + process.env.ERROR_PAGE_DEFAULT));
});

const server = app.listen(app.get("port"), function () {
    console.log("listening at Port localhost:", server.address().port);
});

