const mongoose = require("mongoose");

const User = new mongoose.Schema({
    username: String,
    password: String,
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

module.exports = mongoose.model("User", User);
