const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username: String,
    password: String,
});

module.exports = mongoose.model("User", user);

// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const userSchema = new Schema(
//   {
//     username: { type: String, required: true },
//     password: { type: Number, required: true },
//   },
//   { collection: "users" }
// );

// const User = mongoose.model("User", userSchema);

// module.exports = User;