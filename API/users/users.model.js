const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        unique:true,
        required: true
    },
    username: {
        type: String,
        unique:true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

mongoose.model(process.env.USER_MODEL, UserSchema, process.env.USER_COLLECTION_NAME);