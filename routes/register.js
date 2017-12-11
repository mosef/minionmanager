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
                return res.status(422).json({ success: false, message: 'That username already exists.'});
            }
            return res.status(200).json({ success: true, message: 'successfully created new user.'});
        });
    }
});

registerRouter.post('/authenticate', function(req, res) {
    User.findOne({
        username: req.body.username,
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(400).json({ success: false, messsage: 'Authentication failed. User not found'});
        } else {
            user.comparePassword(req.body.password, function(err, isMatch){
                if (isMatch && !err) {
                    const token = jwt.sign({id: user._id}, config.JWT_SECRET, {
                        expiresIn: 10080
                    });
                    return res.json({success: true, token: 'Bearer ' + token});
                } else {
                    
                res.status(400).json({ success: false, message: 'Athentication failed. Passwords did not match.'});
                }
            });
        }
    });
});


module.exports = registerRouter;
