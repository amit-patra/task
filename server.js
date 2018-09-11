var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var port = 3000;

var api = require('./server/routes/api');
var app = express();

app.use(express.static(path.join(__dirname,"dist/TaskApp")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api',api);

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, 'dist/TaskApp/index.html'));
})

app.listen(port, function(){
    console.log("app is running at ",port);
})