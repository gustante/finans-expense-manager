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


    //to update sumOfExpenses of types
    // for(type of user.types){
    //     console.log(type)
    //     for(expense of user.expenses){
    //         if(expense.month == 3 && expense.type.name == type.name){
    //             type.sumOfExpenses += expense.amount;

    //         }
    //     }
    //     type.save()

    //}



    if (req.session.isAuth) {
        User.findOne({ _id: req.session.userId })//find the user that's making the request
            .populate({ //populate expenses list, then type of every expense. They hold references to other collections
                path: 'expenses',
                populate: { path: 'type' }
            })

            .exec()
            .then(user => {


    // for(type of user.types){

    //     for(expense of user.expenses){
    //         if(expense.month == 3 && expense.type.name == type.name){
    //             type.sumOfExpenses += expense.amount;

    //         }
    //     }
    //     type.save()

    // }


                //sort so that we have recent expenses displayed first
                user.expenses.sort((a, b) => { //https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
                    let da = new Date(a.year,a.month,a.day),
                        db = new Date(b.year,b.month,b.day);
                    return db - da;
                });
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

                //most recent expenses will be placed first
                user.expenses.sort((a, b) => {
                    let da = new Date(a.year,a.month,a.day),
                        db = new Date(b.year,b.month,b.day);
                    return db - da;
                });

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


                            //reset budget when we start a new month
                            // if(user.expenses.length > 0){
                            //     let latestExpenseMonth = user.expenses[user.expenses.length-1].month;
                            //     let newExpenseMonth = expense.month;
                            //     if(newExpenseMonth > latestExpenseMonth){
                            //         for(type of user.types){
                            //             console.log(type)
                            //             type.sumOfExpenses = 0;
                            //             type.save();
                            //         }

                            //     }

                            // }

                            //include to the sum so that we can compare budget later (only if new expense is created for current month. We only keep track of current's month budgets)

                            const current = new Date();
                            const currentMonth = current.getMonth() + 1
                            if(currentMonth == expense.month){
                                chosenType.sumOfExpenses += expense.amount;
                                chosenType.save()
                            }

                            user.expenses.push(expense);
                            user.save()
                            expense.save()
                                .then(savedExpense => {
                                    let {budget, sumOfExpenses, name} = savedExpense.type;
                                    //send SMS using twilio if close to exceeding budget
                                    //dont send SMS if expense created is for a different month.
                                    if(budget != null && currentMonth == savedExpense.month){

                                        if(sumOfExpenses > budget)
                                            smsAlert(`You have exceeded your budget for ${name}, the total amount of expenses is currently ${sumOfExpenses.toFixed(2)}, your budget is ${budget}`)
                                        else if(sumOfExpenses >= budget * 0.7)
                                            smsAlert(`You are about to exceed your budget for ${name}, the total amount of expenses is currently ${sumOfExpenses}, your budget is ${budget}`)
                                        else if(sumOfExpenses >= budget * 0.5)
                                            smsAlert(`You have reached half of your budget for ${name}, the total amount of expenses is currently ${sumOfExpenses}, your budget is ${budget}`)
                                    }



                                    //send SMS using twilio confirming expense creation
                                    var accountSid = process.env.ACCOUNT_SID; // Your Account SID from www.twilio.com/console
                                    var authToken = process.env.AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

                                    var client = new twilio(accountSid, authToken);




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
                let targetExpense = user.expenses.find(expense => expense._id == req.query.expenseId);//compare with id in query parameter

                for (i in user.expenses) {//delete from user.expenses
                    if (user.expenses[i]._id == targetExpense._id) {
                        user.expenses.splice(i, 1)
                    }
                }

                //adjust the type that got and expense delete from to reflect correct sumOfExpenses (only if deletes from current month)
                const current = new Date();
                const currentMonth = current.getMonth() + 1
                if(currentMonth == targetExpense.month){
                    let targetType = user.types.find(type => type.name == targetExpense.type.name);
                    targetType.sumOfExpenses -= targetExpense.amount;
                    if (targetType.sumOfExpenses < 0)
                        targetType.sumOfExpenses = 0
                    targetType.save()
                }
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
