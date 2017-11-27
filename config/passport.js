const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user-model');
const config = require('./main');

module.exports = (passport) => {
    const options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = config.JWT_SECRET;
    passport.use(new JwtStrategy(options, (jwtPayload, done) => {
        User.findById(jwtPayload.id)
            .then((user) => {
                if (user) {
                    const userData = {
                        id: user._id
                    };
                    done(null, userData);
                } else {
                    done(null, false);
                }
            })
            .catch(error => done(error, false));
    }));
};