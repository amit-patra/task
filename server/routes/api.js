
var express = require("express");
var router = express.Router();
var bcrypt = require('bcrypt');
const saltRounds = 10;
var http = require('http');
var base64Img = require('base64-img');
// var user;
const userList = require('../modules/user');
const taskList = require('../modules/task');
const userTask = require('../modules/taskuser');
const jwt = require("jsonwebtoken");
// mLab database connection
const mongoose = require("mongoose");
const db = "mongodb://user:user123@ds151402.mlab.com:51402/task"
mongoose.Promise = global.Promise;
mongoose.connect(db, function (err) {
    if (err) {
        res.send("Error!" + err);
    }
    else {
        console.log("Database connection succesfully");
    }
})
// End
router.get('/', (req, res) => {
    res.send("Api is works");
})
// -----------------------  User ------------------------------------------------//
//  Insert User
router.post('/insertUser', function (req, res) {
    console.log("insert product");
    var user = new userList();
    user.name = req.body.name;
    user.email = req.body.email;
    user.address = req.body.address;
    user.phone = req.body.phone;
    user.role = 'general';
    user.password = req.body.password;
    if (!user.name) {
        res.status(403).send('Plese enter name');
    }
    else if (!user.email) {
        res.status(403).send('Plese enter email')
    }
    else if (!user.phone) {
        res.status(403).send('Plese enter phone number')
    }
    else if (!user.password) {
        res.status(403).send('Plese enter password')
    }
    else {
        userList.find({ email: user.email })
            .exec(function (err, insertuser) {
                if (err) {
                    res.send("Error to retrive data");
                }
                else {
                    if (insertuser.length > 0) {
                        res.status(403).send('Email already exist');
                    }
                    else {
                        var hash = bcrypt.hashSync(user.password, saltRounds);
                        // var salt = bcrypt.genSaltSync(saltRounds);
                        // var hash = bcrypt.hashSync(user.password, salt);
                        user.password = hash;
                        user.save(function (err, insertdata) {
                            if (err) {
                                res.sendStatus(403);
                            }
                            else {
                                // res.json(insertdata);
                                res.status(200).send('Insert Success');
                            }
                        })
                    }
                }
            })
    }

})
// Create token
router.post('/token', (req, res) => {
    var loginUser = new userList();
    loginUser.password = req.body.password;
    loginUser.email = req.body.email;
    userList.find({ email: loginUser.email })
        .exec(function (err, users) {
            if (err) {
                res.send("Error to retrive data");
            }
            else {
                if (users.length > 0) {
                    var passwordStatus = bcrypt.compareSync(loginUser.password, users[0].password);
                    if (users[0].email && passwordStatus) {
                        const user = {
                           // Id: users[0].id, //Remove
                            name: users[0].name,
                            email: users[0].email,
                            role: users[0].role
                        }
                        jwt.sign({ user }, 'secretkey', (err, token) => {
                            // res.json({ 
                            //     token
                            // })
                            if(err){
                                return res.status(500).json({message:'could not authenticate user'})
                            }
                            user.token = token;
                            res.json(user)
                        })
                    }
                    else {
                        res.status(403).send('Please enter valid email or password');
                    }

                }
                else {
                    res.status(403).send('Email is not exist')
                }
            }
        })

})
// login
// router.post('/login', verifyToken, (req, res) => {
//     jwt.verify(req.token, 'secretkey', (err, authData) => {
//         if (err) {
//             res.status(403).send('Something wrong');
//         }
//         else {
//             res.json({
//                 message: 'login success',
//                 authData
//             })
//         }
//     })

// })
// Change password
router.put('/changePassword', verifyToken, function (req, res) {
            // var userId = req.params.uid;
            var password = req.body.password;
            var hash = bcrypt.hashSync(password, saltRounds);
            userList.findByIdAndUpdate(req.user.email,
                {
                    $set: {
                        password: hash,
                    }
                },
                {
                    new: true
                },
                function (err, updatedata) {
                    if (err) {
                        res.send("update error");
                    }
                    else {
                        // res.json(updatedata);
                        res.status(200).send('Update password');
                    }
                }
            )


})
// get user details by id
router.get('/getUserDetails', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.status(403).send('Something wrong');
        }
        else {
            // var userId = req.params.uid;

            userList.find({ email: authData.user.email }, {_id:0, name: 1, email: 1, address:1, phone:1 })
            .exec(function (err, getUserDetails) {
                if (err) {
                    res.send("Error to retrive data");
                }
                else {
                    if (getUserDetails.length > 0) {
                        var userData = getUserDetails[0];
                        res.json({userData})
                    }
                    else{
                        res.status(403).send('Not found');
                    }

                }
            })
        }
    })

})
// Edit Profile
router.put('/updateProfile', verifyToken, function (req, res) {
            // var userId = req.params.uid;
            userList.findOneAndUpdate({email:req.user.email},
                {
                    $set: {
                        name: req.body.name,
                        address: req.body.address,
                        phone: req.body.phone
                    }
                },
                function (err, updatedata) {
                    if (err) {
                        res.send("update error");
                    }
                    else {
                        // res.json(updatedata);
                        res.status(200).send('Update profile');
                    }
                }
            )
})
// Object url to base64
// router.get('/imageConvert', verifyToken, function (req, res) {
//     console.log('aaa');
//     var data = base64Img.base64Sync('blob:http://localhost:4200/ecf8ec72-f4d6-4b20-bef4-693c5fcb45cf');
// })
// End 
// Insert Task
router.post('/insertTask', verifyToken, function (req, res) {
    var task = new taskList();
    task.name = req.body.name;
    task.image = req.body.image;
    task.description = req.body.description; 
    req.body.assignedTo.forEach(element => {
        task.assignedTo.push(element);
    });
    task.createdBy = req.user.email ; 
    task.createdOn = new Date();
    task.save(function(err, insertdata){
        if(err){
            res.status(500).send("Error occurd");
        }
        else{
            res.json(insertdata);
        }
    })

})
// Get all task for admin
router.get('/getAllTask', verifyToken, function (req, res) {
    
    taskList.find( {$or:[{assignedTo : { $in : [req.user.email] }}, {createdBy: req.user.email}]}, {_id:0, name: 1, image: 1, description:1, createdBy:1, createdOn:1, assignedTo:1 })
    .exec(function (err, allTask) {
        if (err) {
            res.send("Error to retrive data");
        }
        else {
            res.json({allTask})
        }
    })

})
// get user taks list
router.get('/userTask', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.status(403).send('Something wrong');
        }
        else {
            //taskList -- userTask
            // taskList.aggregate({
            //     $lookup:
            //         {
            //             from: "userTask",
            //             localField: "_id",
            //             foreignField : "taskId",
            //             as: "user_task"
            //         },
            //         function (err, getdata) {
            //             if (err) {
            //                 res.send("update error");
            //             }
            //             else {
            //                 // res.json(updatedata);
            //                 res.status(200).send('Update profile');
            //             }
            //         }
            //     })
            // taskList.find({ }, {_id:0, name: 1, image: 1, description:1, createdBy:1, createdOn:1 })
            // taskList.aggregate([
            //     // {$match : {emai : 'kd@gmail.com'}},
            //     {$lookup: {from: "userTask",localField: "_id",foreignField: "taskId",as: "userTask"}},

            
            // ])
            taskList.find( { "assignedIn" : { $in: ['5b9a30ccfb6fc01dae445e60' ] } } )
            .exec(function (err, allTask) {
                if (err) {
                    res.send("Error to retrive data");
                }
                else {
                    if (allTask.length > 0) {
                        // var task = allTask[0];
                        res.json({allTask})
                    }
                    else{
                        res.status(403).send('Not found');
                    }

                }
            })
        }
    })

})
// Get all users
router.get('/getAllUser', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.status(403).send('Something wrong');
        }
        else {
            userList.find({role:'general'}, {_id:0, name: 1, email: 1 })
            .exec(function (err, allTask) {
                if (err) {
                    res.send("Error to retrive data");
                }
                else {
                    if (allTask.length > 0) {
                        // var task = allTask[0];
                        res.json(allTask)
                    }
                    else{
                        res.status(403).send('Not found');
                    }

                }
            })
        }
    })
})
// verifyToken token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader != 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        return jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (!err) {
                req.user = authData.user;
                return next();
            }
            return res.sendStatus(403);
        });
       // next();
    }
    res.sendStatus(403);
}

module.exports = router;