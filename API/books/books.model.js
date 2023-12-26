const mongoose = require("mongoose");
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    location: {
        //store coordinates in order longitude(E/W),latitude(N/S)
        coordinates: {
            type: [Number],
            index: "2dsphere"
        }
    }
});
const bookSchema =  new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    noOfPages: Number,
    year: Number,
    publisherName: String,
    authors: {
        type: [authorSchema],
        validate: {
            validator: function (authors) {
                return authors.length > 0;
            },
            message: process.env.AT_LEAST_ONE_AUTHOR_REQUIRED_MESSAGE
        }
    }

})

mongoose.model(process.env.BOOK_MODEL, bookSchema, process.env.BOOK_COLLECTION_NAME);