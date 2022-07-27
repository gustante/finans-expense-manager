const axios = require('axios');
const User = require('../models/User.js');
const Expense = require('../models/Expense.js');
const Type = require('../models/Type.js');
const AccessToken = require('../models/AccessToken.js');
require('dotenv').config();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const moment = require('moment');
const customError = require('../customError.js');


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
            client_name: 'Finans Expense Manager',
            products: PLAID_PRODUCTS,
            country_codes: PLAID_COUNTRY_CODES,
            redirect_uri: PLAID_REDIRECT_URI,
            language: 'en',
        };

        const createTokenResponse = await client.linkTokenCreate(configs);

        //if user already has accees token let front-end know so that it loads transactions right away in table
        if (user.plaidAccessTokens && user.plaidAccessTokens.length > 0) {
            createTokenResponse.data.hasAccessToken = true;
        }

        //res.send(createTokenResponse.data);
        res.send(createTokenResponse.data)

    } else {
        let errorObject = new customError(['Please log in to see this information'], 401);
        res.status(errorObject.status).send(errorObject);
    }

}

// Exchange token flow - exchange a Link public_token for
// an API access_token
exports.exchangePublicToken = async (req, res) => {
    if (req.session.isAuth) {
        console.log("received request to exchange public token")
        console.log("Info from user:")
        console.log(req.body)

        const alreadyHasToken = await AccessToken.findOne({ institutionName: req.body.institution.name, userId: req.session.userId });


        //create new item if institution hasn't been linked already
        if (alreadyHasToken === null) {
            try {
                const tokenResponse = await client.itemPublicTokenExchange({
                    public_token: req.body.public_token,
                });

                const user = await User.findById(req.session.userId);
                console.log(tokenResponse.data)

                const accessToken = new AccessToken({
                    userId: user.id,
                    token: tokenResponse.data.access_token,
                    itemId: tokenResponse.data.item_id,
                    institutionName: req.body.institution.name,
                    accounts: req.body.accounts,
                });
                await accessToken.save();
                user.plaidAccessTokens.push(accessToken);
                await user.save()

                console.log("received access token from plaid :")
                console.log(accessToken)

                res.send("item created")
            } catch (error) {
                console.log(error)
                console.log(error.data)
            }
        } else {
            console.log("item already exists")
            let errorObject = new customError(['Institution already connected'], 422);
            res.status(errorObject.status).send(errorObject);

        }
    } else {
        let errorObject = new customError(['Please log in to see this information'], 401);
        res.status(errorObject.status).send(errorObject);
    }

}

exports.getTransactions = async (req, res) => {
    if (req.session.isAuth) {
        const accessTokens = await AccessToken.find({ userId: req.session.userId });

        //get todays day
        const today = moment().format('DD');
        //get only transactions for current month up until today
        const startDate = moment().subtract(today - 1, 'days').format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');

        const arrayOfTransactions = [];

        if (accessTokens && accessTokens.length > 0) {

            for (let accessToken of accessTokens) {
                accessToken.noOfTransactions = 0;
                const request = {
                    access_token: accessToken.token,
                    options: {
                        count: 250,
                    },
                    start_date: startDate,
                    end_date: endDate,
                };
                const getTransactionsResponse = await client.transactionsGet(request);
                let transactions = getTransactionsResponse.data.transactions;

                console.log("received transactions from plaid :")
                for (let transaction of transactions) {
                    if (transaction.amount > 0) {
                        arrayOfTransactions.push({
                            _id: transaction.transaction_id,
                            account_id: accessToken.itemId,
                            name: transaction.name,
                            amount: transaction.amount,
                            date: transaction.date,
                            category: transaction.category,
                        })
                    }
                    accessToken.noOfTransactions += 1;

                }
                await accessToken.save();
            }

            res.send(arrayOfTransactions)
        } else {
            let errorObject = new customError(['No institutions linked'], 422);
            res.status(errorObject.status).send(errorObject);
        }

    } else {
        let errorObject = new customError(['Please log in to see this information'], 401);
        res.status(errorObject.status).send(errorObject);
    }
}





exports.syncTransactions = async (req, res) => {
    const allUsers = await User.find().populate({
        path: 'expenses',
        populate: { path: 'type' }
    }).populate('types').exec();


    for (let user of allUsers) {
        console.log("user to be synced:")
        console.log(user.firstName)

        //get all items that user has connected
        const accessTokens = await AccessToken.find({ userId: user._id });

        if (accessTokens != null && accessTokens.length > 0) {
            //get todays day
            const today = moment().format('DD');
            //get only transactions for current month up until today
            const startDate = moment().subtract(today - 1, 'days').format('YYYY-MM-DD');
            const endDate = moment().format('YYYY-MM-DD');

            for (let accessToken of accessTokens) {
                const request = {
                    access_token: accessToken.token,
                    options: {
                        count: 250,
                    },
                    start_date: startDate,
                    end_date: endDate,
                };
                const getTransactionsResponse = await client.transactionsGet(request);
                let transactions = getTransactionsResponse.data.transactions;



                for (let transaction of transactions) {
                    //check if transaction already exists
                    let transactionExists = false;
                    for (let i = user.expenses.length - 1; i >= 0; i--) {
                        if (user.expenses[i].plaidId == transaction.transaction_id) {
                            console.log("transaction already exists, skipping")
                            transactionExists = true;
                            break;
                        }
                    }
                    if (transaction.amount > 0 && !transactionExists) {
                        let chosenType;
                        //check if user has type that matches transaction.category
                        //find types that belong to user

                        //what does this do?    
                        for (let type of user.types) {
                            if (type.name == transaction.category[0]) {
                                chosenType = type;
                                console.log("found type")
                                break;

                            }
                        }
                        if (!chosenType) {
                            console.log("did not find type")
                            chosenType = new Type({
                                name: transaction.category[0],
                                budget: "",
                                sumOfExpenses: 0,
                                user: user._id
                            });
                            await chosenType.save();
                            user.types.push(chosenType);

                        }

                        console.log("type chosen is:")
                        console.log(chosenType)

                        //separate transaction.date into year, month, day
                        const date = moment(transaction.date);
                        const year = date.format('YYYY');
                        const month = date.format('MM');
                        const day = date.format('DD');

                        //create new expense if user doesn't already have one 
                        let expense = new Expense({
                            month: month,
                            day: day,
                            year: year,
                            type: chosenType,
                            description: transaction.name,
                            amount: transaction.amount,
                            user: user._id,
                            recurring: false,
                            frequency: "",
                            plaidId: transaction.transaction_id,
                        });

                        chosenType.sumOfExpenses += transaction.amount;
                        user.expenses.push(expense);
                        await chosenType.save();
                        await expense.save();
                        await user.save()
                        console.log("expense saved")

                    }

                }
            }
            console.log("user synced")

        } else {
            console.log("user has no access tokens. Nothing to be done")

        }



    }

    res.send("done")
}


exports.getItems = async (req, res) => {
    console.log("get items")
    if (req.session.isAuth) {
        const accessTokens = await AccessToken.find({ userId: req.session.userId });


        let items = [];
        for (let accessToken of accessTokens) {
            console.log("access token:")
            console.log(accessToken)
            items.push({institutionName: accessToken.institutionName,
                        itemId: accessToken.itemId,
                        noOfTransactions: accessToken.noOfTransactions
                    })
        }
        res.send(items)
            

    } else {
        let errorObject = new customError(['Please log in to see this information'], 401);
        res.status(errorObject.status).send(errorObject);
    }
}

exports.unlinkAccount = async (req, res) => {
    console.log("received request to delete item: ")
    console.log(req.query.itemId)
    if (req.session.isAuth) {

        //remove from user's access tokens
        const user = await User.findById(req.session.userId).populate('plaidAccessTokens').exec();
        console.log(user)

        for (let i = user.plaidAccessTokens.length - 1; i >= 0; i--) {
            if (user.plaidAccessTokens[i].itemId == req.query.itemId) {
                console.log("found item to be deleted")
                user.plaidAccessTokens.splice(i, 1);
            }
        }
        await user.save();

        //remove from access tokens
        const accessToken = await AccessToken.findOneAndDelete({ itemId: req.query.itemId });
        console.log(accessToken)

        
        console.log("deleted")
        res.send("done")

        
    } else {
        let errorObject = new customError(['Please log in to see this information'], 401);
        res.status(errorObject.status).send(errorObject);
    }
    

}

