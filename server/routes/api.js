

var express = require("express");
var router = express.Router();
// const productList = require('../modules/productList');
// mLab database connection
const mongoose = require("mongoose");
// const db = "mongodb://amit_patra1:amit_patra1@ds125422.mlab.com:25422/product_dbs";
const db= "mongodb://user:user123@ds151402.mlab.com:51402/task"
mongoose.Promise = global.Promise;
mongoose.connect(db, function(err){
        if(err){
            res.send("Error!" + err);
        }
        else{
            console.log("Database connection succesfully");
        }
}) 
// End
router.get('/',(req,res)=>{
    res.send("Api is works");
})



module.exports = router;