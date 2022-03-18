const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypeSchema = new Schema({
    name: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    budget: {type: Number},
    sumOfExpenses: {type: Number}
});

const Type = mongoose.model("Type", TypeSchema);

module.exports = Type;
