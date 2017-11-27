const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('../models/user-model');
const registerRouter = express.Router();
const jsonParser = bodyParser.json();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('../config/main')

registerRouter.post('/sign-up', (req, res) => {
    if (!req.body.username || !req.body.password) {
       return res.sendStatus(401)
        res.json({ success: false, message: 'please enter a username and password to register.'});
    } else {
        let newUser = new User({
            username: req.body.username,
            password: req.body.password
        });
        newUser.save(function(err) {
            if (err) {
                return res.json({ success: false, message: 'That username already exists.'});
            }
            return res.sendStatus(201);
            res.json({ success: true, message: 'successfully created new user.'});
        });
    }
});

registerRouter.post('/authenticate', function(req, res) {
    User.findOne({
        username: req.body.username,
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({ success: false, messsage: 'Authentication failed. User not found'});
        } else {
            user.comparePassword(req.body.password, function(err, isMatch){
                if (isMatch && !err) {
                    const token = jwt.sign({id: user._id}, config.JWT_SECRET, {
                        expiresIn: 10080
                    });
                    return res.sendStatus(200)
                    res.json({success: true, token: 'Bearer ' + token});
                } else {
                    
                    res.send({ success: false, message: 'Athentication failed. Passwords did not match.'});
                }
            });
        }
    });
});


module.exports = registerRouter;
