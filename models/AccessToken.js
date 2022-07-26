const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccessTokenSchema = new Schema({
    userId: { type: String, required: true },
    token: { type: String, required: true },
    itemId: { type: String, required: true },
    institutionName: { type: String, required: true },
    accounts: { type: Array, required: true },

});

const AccessToken = mongoose.model("AccessToken", AccessTokenSchema);

module.exports = AccessToken;
