const Expense = require('../models/Expense.js');
const Type = require('../models/Type.js');
const User = require('../models/User.js');
const { validationResult } = require('express-validator');
const axios = require('axios');
const querystring = require('querystring');
var twilio = require('twilio');
const customError = require('../customError.js')

////gets and array of all expenses
exports.getAllExpenses = (req, res) => {

    // Expense.find({})//find the user that's making the request
    //                 .exec()
    //                 then(results => {
                        
    //                     console.log(results)
    //                     console.log(user)
    //                     console.log(user.expenses)
    //                 for (expense of results){
                        
    //                     user.expenses.push(expense)
    //                 }
    //                 user.save()
    //             })



    if (req.session.isAuth) {
        User.findOne({ _id: req.session.userId })//find the user that's making the request
            .populate({ //populate expenses list, then type of every expense. They hold references to other collections
                path: 'expenses',
                populate: { path: 'type' }
            })
            .exec()
            .then(user => {
                res.send(user.expenses);
            })
            .catch(error => res.send(error));
    } else {
        let errorObject = new customError(['Please log in to see this information'], 401);
        res.status(errorObject.status).send(errorObject);
    }

}

// ////search by id. 
// exports.getExpenseById = (req, res) => {

//     Expense.findOne({ "_id": req.params.id })
//         .exec()
//         .then(result => {
//             res.send(result)
//         })
//         .catch(error => {
//             res.status(404).send(error.message)
//         })
// }

//search by expenses filter fields
exports.getExpense = (req, res) => {

    if (req.session.isAuth) {
        User.findOne({ _id: req.session.userId })
            .populate({
                path: 'expenses',
                populate: { path: 'type' }
            })
            .exec()
            .then(user => {

                //gets array of expenses and performs filter according to user inputs
                if (req.query.month != "") {
                    user.expenses = user.expenses.filter(expense => expense.month == req.query.month)
                }
                if (req.query.day != "") {
                    user.expenses = user.expenses.filter(expense => expense.day == req.query.day)
                }
                if (req.query.year != "") {
                    user.expenses = user.expenses.filter(expense => expense.year == req.query.year)
                }
                if (req.query.type != "") {
                    user.expenses = user.expenses.filter(expense => expense.type.name == req.query.type)
                }
                if (req.query.amount != 0) {
                    user.expenses = user.expenses.filter(expense => expense.amount == req.query.amount)
                }

                res.send(user.expenses);
            })
            .catch(error => res.send(error));
    } else {
        let errorObject = new customError(['Please log in to see this information'], 401);
        res.status(errorObject.status).send(errorObject);
    }

}


//post new expenses
exports.postExpense = (req, res) => {
    if (req.session.isAuth) {
        const errors = (validationResult(req)).array();

        //verify token agaisnt reCAPTCHA service
        axios.post('https://www.google.com/recaptcha/api/siteverify',
            querystring.stringify({
                secret: process.env.RECAPTCHA_SECRET,
                response: req.body.token
            })
        )
            .then(response => {

                //If validation fails or score is too low, push an error inside Error's array
                if (!response.data.success || response.data.score < 0.80) {
                    errors.push({ msg: 'reCAPTCHA failed. Score: ' + response.data.score + ", Success: " + response.data.success })
                }
            })
            .then(() => {
                //if there are not validation errors, create new expense and save it to database
                if (errors.length < 1) {
                    User.findOne({ _id: req.session.userId })
                        .populate('expenses')
                        .populate('types')
                        .exec()
                        .then(user => {
                            let chosenType = user.types.find(type => type.name == req.body.type); //search for a type with the value passed among the types the user has
                            let expense = new Expense({
                                month: req.body.month,
                                day: req.body.day,
                                year: req.body.year,
                                type: chosenType,//reference to type schema
                                description: req.body.desc,
                                amount: req.body.amount,
                                user: user._id
                            });
                            user.expenses.push(expense);


                            user.save()
                            expense.save()
                                .then(savedExpense => {
                                    res.status(201).send(savedExpense);//status 201

                                    //send SMS using twilio confirming expense creation
                                    var accountSid = process.env.ACCOUNT_SID; // Your Account SID from www.twilio.com/console
                                    var authToken = process.env.AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

                                    var client = new twilio(accountSid, authToken);

                                    client.messages.create({
                                        body: 'A new expense \"' + savedExpense.description + '\" was created',
                                        to: '+12368636833',  // Text this number
                                        from: '+19197523572' // From a valid Twilio number
                                    })
                                        .then(message => {
                                            console.log('message sent succesfully')
                                        })

                                })
                                .catch(error => {
                                    console.log(error);
                                });

                        })
                        .catch(error => {
                            console.log(error);
                        });

                } else { // if there are errors, extracts messages from validation errors array and send to frontend
                    let errorMessages = [];
                    for (let i of errors) {
                        errorMessages.push(i.msg)
                    }

                    let errorObject = new customError(errorMessages, 422);

                    res.status(errorObject.status).send(errorObject);

                }
            })

    } else {
        let errorObject = new customError(['Please log in to create new expense'], 401);
        res.status(errorObject.status).send(errorObject);
    }



}

////delete expense by id which is passed by thery
exports.deleteExpense = (req, res) => {

    if (req.session.isAuth) {
        User.findOne({ _id: req.session.userId })//delete from users collection
            .exec()
            .then(user => {
                let targetExpense = user.expenses.find(expense => expense == req.query.expense);//compare with id in query parameter
                for (i in user.expenses) {
                    if (user.expenses[i] == targetExpense) {
                        user.expenses.splice(i, 1)
                    }
                }
                console.log(user.expenses)
                user.save()

            })
            .then(() => { //delete from expenses collection
                Expense.deleteOne({ _id: req.query.expense }).exec()
                    .then(results => {
                        res.send(results);

                    })
                    .catch(error => res.send(error));

            })
            .catch(error => res.send(error));

    } else {
        let errorObject = new customError(['Please log in to delete expense'], 401);
        res.status(errorObject.status).send(errorObject);
    }



}

exports.updateExpense = (req, res) => {
    if (req.session.isAuth) {

        User.findOne({ _id: req.session.userId })//find the user that's making the request
            .populate('expenses')
            //Expense.findOneAndUpdate({ "_id": req.body.expenseId }, { type: req.body.newTypeId }, { new: true })
            .exec()
            .then(user => {
                let targetExpense = user.expenses.find(expense => expense._id == req.body.expenseId);
                targetExpense.type = req.body.newTypeId
                targetExpense.save()
                    .then(savedExpense => {
                        res.send(savedExpense);
                    })

            })
            .catch(error => res.send(error));
    } else {
        let errorObject = new customError(['Please log in first'], 401);
        res.status(errorObject.status).send(errorObject);
    }

}
