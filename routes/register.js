const express = require("express");
const User = require("../models/user-model");
const registerRouter = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config/main");

registerRouter.post("/sign-up", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: "please enter a username and password to register."
    });
  } else {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    newUser
      .save()
      .then(user => {
        return res
          .status(200)
          .json({ success: true, message: "successfully created new user." });
      })
      .catch(err => {
        return res
          .status(422)
          .json({ success: false, message: "That username already exists." });
      });
  }
});

registerRouter.post("/authenticate", function(req, res) {
  User.findOne({ username: req.body.username })
    .then(foundResult => {
      if (!foundResult) {
        return res.status(400).json({
          success: false,
          messsage: "Authentication failed. User not found"
        });
      }
      return foundResult;
    })
    .then(foundUser => {
      foundUser.comparePassword(req.body.password).then(comparingResult => {
        if (!comparingResult) {
          return res.status(400).json({
            success: false,
            message: "Athentication failed. Passwords did not match."
          });
        }
        const tokenPayload = {
          id: foundUser._id
        };
        const token = jwt.sign(tokenPayload, config.JWT_SECRET, {
          expiresIn: 10080
        });
        return res.json({ success: true, token: "Bearer " + token });
      });
    })
    .catch(report =>
      res.status(400).json({
        success: false,
        messsage: "Something Went Wrong."
      })
    );
});

module.exports = registerRouter;
