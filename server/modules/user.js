const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:String,
    email:String, 
    address: String,
    phone:Number,
    role:String,
    password:String
}) 
module.exports = mongoose.model('userLists', userSchema, 'userList');