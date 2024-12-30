// const mongoose = require('mongoose')
// //This is a comment
// const UsersSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     isAdmin: {
//         type: Boolean,
//         required: false
//     },
// })
// const UserModel = mongoose.model("users", UsersSchema)
// module.exports = UserModel

const mongoose = require("mongoose");
// This is a comment
const UsersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: false,
  },
});

const UserModel = mongoose.model("users", UsersSchema);
module.exports = UserModel;
