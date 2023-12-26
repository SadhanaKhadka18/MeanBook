const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
require("../books/books.model");
require("../users/users.model");

mongoose.connection.on("connected", function () {
    console.log("mongoose Connected to ", process.env.DB_URL);
})

mongoose.connection.on("disconnected", function () {
    console.log("mongoose disconnected");
})

mongoose.connection.on("error", function () {
    console.log("Mongoose Connection error");
})




process.on("SIGINT", function () {
    mongoose.disconnect().then(()=> {
        (function () {
            console.log(process.env.SIGINT_MESSAGE);
            process.exit(0);
        })
    });
});
process.on("SIGTERM", function () {
    mongoose.disconnect().then(function () {
        console.log(process.env.SIGTERM_MESSAGE);
        process.exit(0);
    });
});
process.on("SIGUSR2", function () {
    console.log("siguser2");
    mongoose.disconnect().then(function () {
        console.log(process.env.SIGUSR2_MESSAGE);
        process.kill(process.pid, "SIGUSR2");
    });
});