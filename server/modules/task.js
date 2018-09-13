const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name:String,
    image:String, 
    description: String,
    assignedTo: [String],
    createdBy:String,
    createdOn:Date,
}) 
module.exports = mongoose.model('taskLists', taskSchema, 'taskList');