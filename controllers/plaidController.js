const axios = require('axios');
const User = require('../models/User.js');
require('dotenv').config();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const moment = require('moment');

const APP_PORT = process.env.PORT || 8081
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(
    ',',
);
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
    ',',
);

let PUBLIC_TOKEN = null;
let ITEM_ID = null;

const configuration = new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
            'PLAID-SECRET': PLAID_SECRET,
            'Plaid-Version': '2020-09-14',
        },
    },
});



const client = new PlaidApi(configuration);


exports.createLinkToken = async (req, res) => {
    if (req.session.isAuth) {
        console.log("received request to get link token")
        const user = await User.findById(req.session.userId);

        const configs = {
            user: {
                // This should correspond to a unique id for the current user.
                client_user_id: user.id,
            },
            client_name: 'Gustante',
            products: PLAID_PRODUCTS,
            country_codes: PLAID_COUNTRY_CODES,
            language: 'en',
        };

        const createTokenResponse = await client.linkTokenCreate(configs);

        //res.send(createTokenResponse.data);
        res.send(createTokenResponse.data)

    } else {
        let errorObject = new customError(['Please log in to see this information'], 401);
        res.status(errorObject.status).send(errorObject);
    }




}

