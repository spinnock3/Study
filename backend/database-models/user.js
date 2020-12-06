const mongoose = require('mongoose');
const config = require('../../config');

const userSchema = mongoose.Schema({
    email: {type: String, required: [true, "User email is required"], maxLength: [150, "User email must be 150 characters or less."], unique: true},
    password: {type: String, maxLength: [150, "User password must be 150 characters or less"]},
    last_login: {type: Date, required: false},
    name: {type: String, required:[true, 'User name is required'], maxlength:[200, 'User name must be 150 characters or less.']},
    user_roles: {type: [String], required: true, default: ['student'], enum: config.get('user_roles')},
    profile_color: {type: String, required: false, default: '#4B8B9B'},
    profile_pic: {type: String, required: false, default: ''},
    phone_num: {type: String, required: false, match:[config.get('phone_number_regex'), 'Incorrect Cell Phone Number Format']},
    points: {type: Number, required: [true, "User points is required"], default: 0}
})

module.exports = mongoose.model('User', userSchema);