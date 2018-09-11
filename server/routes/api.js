
var express = require("express");
var router = express.Router();
var bcrypt = require('bcrypt');
const saltRounds = 10;
const userList = require('../modules/user');
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
            .exec(function (err, user) {
                if (err) {
                    res.send("Error to retrive the videos");
                }
                else {
                    if (user.length > 0) {
                        res.status(403).send('Email already exist');
                    }
                    else {
                        var hash = bcrypt.hashSync(user.password, saltRounds);
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
        .exec(function (err, userList) {
            if (err) {
                res.send("Error to retrive the videos");
            }
            else {
                if (userList.length > 0) {
                    var passwordStatus = bcrypt.compareSync(loginUser.password, userList[0].password);
                    if (userList[0].email && passwordStatus) {
                        const user = {
                            Id: userList[0].id,
                            name: userList[0].name,
                            email: userList[0].email
                        }
                        jwt.sign({ user }, 'secretkey', (err, token) => {
                            res.json({
                                token
                            })
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
router.post('/login', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.status(403).send('Something wrong');
        }
        else {
            res.json({
                message: 'login success',
                authData
            })
        }
    })

})
// Change password
router.put('/changePassword', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.status(403).send('Something wrong');
        }
        else {
            var userId = req.body.id;
            var password = req.body.password;
            var hash = bcrypt.hashSync(password, saltRounds);
            userList.findByIdAndUpdate(userId,
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
        }
    })

})
// Edit Profile
router.put('/updateProfile', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.status(403).send('Something wrong');
        }
        else {
            var userId = req.body.id;
            var password = req.body.password;
            var hash = bcrypt.hashSync(password, saltRounds);
            userList.findByIdAndUpdate(userId,
                {
                    $set: {
                        name: req.body.name,
                        address: req.body.address,
                        phone: req.body.phone,
                        password: password,
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
                        res.status(200).send('Update profile');
                    }
                }
            )
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
        next();
    }
    else {
        res.sendStatus(403);
    }
}

module.exports = router;