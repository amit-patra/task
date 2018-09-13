const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskUserSchema = new Schema({
    taskId:String,
    email:String, 
}) 
module.exports = mongoose.model('userTask', taskUserSchema, 'taskUsers');