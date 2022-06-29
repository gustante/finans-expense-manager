const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    month:{type: Number, require: true},
    day:{type: Number, require: true},
    year:{type: Number, require: true},
    type:{type: Schema.Types.ObjectId, ref: 'Type', required: true},
    description:{type:String, required: true},
    amount:{type:Number, required: true},
    user:{type: Schema.Types.ObjectId, ref: 'User', required: true},
    recurring: {type: Boolean, default: false, required: false},
    
});

const Expense = mongoose.model("Expense", ExpenseSchema);

module.exports = Expense;