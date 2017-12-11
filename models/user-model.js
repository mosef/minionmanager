const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''}
});

UserSchema.pre('save', function(next) {
    let user = this;
    if(this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next (err);
                }
                user.password = hash
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function(pw, cb) {
    bcrypt.compare(pw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
}

UserSchema.methods.apiRepr = function() {
    return {
        _id: this._id,
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || ''
    };
};

const User = mongoose.model('User', UserSchema);

module.exports = User;