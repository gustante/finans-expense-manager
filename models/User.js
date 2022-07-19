const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ExpenseSchema} = require("./Expense.js")

const UserSchema = new Schema({
    firstName:{type: String, required: true},
    lastName:{type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phoneNumber:{type: String, require: false},
    expenses:[{type: Schema.Types.ObjectId, ref: 'Expense'}], //every user document holds an array of references to 'Expense' documents
    types:[{type: Schema.Types.ObjectId, ref: 'Type'}], //each user will also have their own types,
    lastLoginMonth:{type: Number, require: false},
    lastLoginYear:{type: Number, require: false},
    googleUser: {type: Boolean, require: true},
    plaidAccessToken: {type: String, require: false, default: null},


});

module.exports = mongoose.model('User', UserSchema);