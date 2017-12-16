const mongoose = require("mongoose");
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

UserSchema.pre('save', function userPreSave(next) {
    let user = this;
    if(this.isModified('password') || this.isNew) {
       return bcrypt.hash(user.password, 10)
        .then((hash) => {
            user.password = hash;
            return next();
        })
        .catch(err => next(err));
    }
    return next();
});

UserSchema.methods.comparePassword = function userComparePassword(password) {
    return bcrypt.compare(password, this.password);
};

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