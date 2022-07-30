const Expense = require('../models/Expense.js');
const Type = require('../models/Type.js');
const User = require('../models/User.js');
const { validationResult } = require('express-validator');
const axios = require('axios');
const querystring = require('querystring');
var twilio = require('twilio');
const { smsAlert } = require('../twilioSMS.js');
const { emailAlert } = require('../nodeMailer.js');
const customError = require('../customError.js');
require('dotenv').config();


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
            .populate('types')
            .populate({ //populate expenses list, then type of every expense. They hold references to other collections
                path: 'expenses',
                populate: { path: 'type' }
            })

            .exec()
            .then(user => {

                //sort so that we have recent expenses displayed first
                user.expenses.sort((a, b) => { //https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
                    let da = new Date(a.year, a.month, a.day),
                        db = new Date(b.year, b.month, b.day);
                    return db - da;
                });
                //filter out future expenses
                user.expenses = user.expenses.filter(expense => {
                    let date = new Date(expense.year, expense.month - 1, expense.day);
                    return date < new Date();
                });

                res.send(user.expenses);
            })
            .catch(error => {
                console.log(error)
                res.send(error)
            });

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

                if (req.query.ids) {
                    //split req.query.ids into an array of strings separated by commas
                    let recurringExpenseIds = req.query.ids.split(',');

                    if (recurringExpenseIds.length > 0) {
                        //find all expenses that have an id in the recurringExpenseIds array
                        let results = user.expenses = user.expenses.filter(expense => {
                            return recurringExpenseIds.includes(expense._id.toString());
                        });
                        res.send(results);
                    }

                }

                else {
                    console.log(req.query)
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
                    if (req.query.desc != "") {
                        user.expenses = user.expenses.filter(expense => expense.description.toLowerCase().includes(req.query.desc.toLowerCase()))
                    } if (req.query.recurring == "true") {
                        user.expenses = user.expenses.filter(expense => expense.recurring == true)
                        if (req.query.frequency == 'weekly') {
                            user.expenses = user.expenses.filter(expense => expense.frequency == 'weekly')
                        } else if (req.query.frequency == 'monthly') {
                            user.expenses = user.expenses.filter(expense => expense.frequency == 'monthly')
                        } else if (req.query.frequency == 'bi-weekly') {
                            user.expenses = user.expenses.filter(expense => expense.frequency == 'bi-weekly')
                        }
                    }

                    //most recent expenses will be placed first
                    user.expenses.sort((a, b) => {
                        let da = new Date(a.year, a.month, a.day),
                            db = new Date(b.year, b.month, b.day);
                        return db - da;
                    });

                    res.send(user.expenses);
                }


            })
            .catch(error => {
                console.log(error)
                res.send(error)
            });

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
                if (!response.data.success || response.data.score < 0.2) {
                    errors.push({ msg: 'reCAPTCHA failed. Score: ' + response.data.score + ", Success: " + response.data.success })

                    let rError = new customError(['reCAPTCHA failed', 'Score: ' + response.data.score], 401)
                    res.status(rError.status).send(rError);
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
                                user: user._id,
                                recurring: req.body.recurring,
                                frequency: req.body.frequency
                            });

                            user.expenses.push(expense);

                            //include to the sum so that we can compare budget later (only if new expense is created for current month. We only keep track of current's month budgets)

                            const current = new Date();
                            const currentMonth = current.getMonth() + 1
                            if (currentMonth == expense.month) {
                                chosenType.sumOfExpenses += expense.amount;
                            }


                            //RECURRING EXPENSES CREATION
                            let arrayOfExpensesInSameMonth = [] //keep track and send later with response
                            if (req.body.recurring == true) {
                                if (req.body.frequency == "monthly") {
                                    //create monthly expenses
                                    //create date object using month and year passed
                                    let todaysDate = new Date(req.body.year, req.body.month, req.body.day);
                                    var todaysYear = todaysDate.getFullYear();
                                    //count how many months until the end of the year
                                    //create expenses until the end of the year
                                    while (todaysDate.getFullYear() <= todaysYear) {

                                        let newExpense = new Expense({
                                            month: todaysDate.getMonth() + 1,
                                            day: todaysDate.getDate(),
                                            year: todaysDate.getFullYear(),
                                            type: chosenType,
                                            description: req.body.desc,
                                            amount: req.body.amount,
                                            user: user._id,
                                            recurring: true,
                                            frequency: req.body.frequency
                                        });
                                        user.expenses.push(newExpense);
                                        newExpense.save()
                                        //add one month to todaysDate
                                        todaysDate.setMonth(todaysDate.getMonth() + 1);

                                    }
                                } else if (req.body.frequency == "weekly") {
                                    //create weekly expenses
                                    //create date object using month and year passed
                                    let todaysDate = new Date(req.body.year, req.body.month - 1, req.body.day);
                                    //add 7 days to todaysDate
                                    todaysDate.setDate(todaysDate.getDate() + 7);
                                    var todaysYear = todaysDate.getFullYear();
                                    //count how many weeks until the end of the year
                                    //create expenses until the end of the year
                                    while (todaysDate.getFullYear() <= todaysYear) {
                                        //create expenses until the end of the year

                                        let newExpense = new Expense({
                                            month: todaysDate.getMonth() + 1,
                                            day: todaysDate.getDate(),
                                            year: todaysDate.getFullYear(),
                                            type: chosenType,
                                            description: req.body.desc,
                                            amount: req.body.amount,
                                            user: user._id,
                                            recurring: true,
                                            frequency: req.body.frequency
                                        });
                                        user.expenses.push(newExpense);
                                        newExpense.save()
                                        //adjusts sumOfExpenses for multiple creations in the same month
                                        if (currentMonth == newExpense.month) {
                                            chosenType.sumOfExpenses += newExpense.amount;
                                            arrayOfExpensesInSameMonth.push(newExpense)
                                        }
                                        //add one week to todaysDate
                                        todaysDate.setDate(todaysDate.getDate() + 7);

                                    }
                                } else if (req.body.frequency == "bi-weekly") {
                                    //create daily expenses
                                    //create date object using month and year passed
                                    let todaysDate = new Date(req.body.year, req.body.month - 1, req.body.day);
                                    //add 14 days to todaysDate
                                    todaysDate.setDate(todaysDate.getDate() + 14);
                                    var todaysYear = todaysDate.getFullYear();
                                    //count how many expenses until the end of the year
                                    //create expenses until the end of the year
                                    while (todaysDate.getFullYear() <= todaysYear) {
                                        //create expenses until the end of the year

                                        let newExpense = new Expense({
                                            month: todaysDate.getMonth() + 1,
                                            day: todaysDate.getDate(),
                                            year: todaysDate.getFullYear(),
                                            type: chosenType,
                                            description: req.body.desc,
                                            amount: req.body.amount,
                                            user: user._id,
                                            recurring: true,
                                            frequency: req.body.frequency
                                        });
                                        user.expenses.push(newExpense);
                                        newExpense.save()
                                        //adjusts sumOfExpenses for multiple creations in the same month
                                        if (currentMonth == newExpense.month) {
                                            chosenType.sumOfExpenses += newExpense.amount;
                                            arrayOfExpensesInSameMonth.push(newExpense)
                                        }
                                        //add one week to todaysDate
                                        todaysDate.setDate(todaysDate.getDate() + 14);

                                    }
                                }

                            }
                            //END OF RECURRING EXPENSES CREATION



                            user.save()
                            chosenType.save()
                            expense.save()
                                .then(savedExpense => {
                                    //add at the beginnig of array so it shows up first
                                    arrayOfExpensesInSameMonth.unshift(savedExpense)

                                    res.status(201).send(arrayOfExpensesInSameMonth);//status 201


                                    let { budget, sumOfExpenses, name } = savedExpense.type;
                                    //send email

                                    if (budget != null && currentMonth == savedExpense.month) {
                                        console.log("will email to " + user.email)
                                        if (sumOfExpenses > budget)
                                            emailAlert("Budget Alert", `Dear user,  \n\nThis message is to let you know that you have exceeded your budget for \"${name}\" for this month, the total amount of expenses is currently $${sumOfExpenses.toFixed(2)}, your budget is $${budget} \n\n Sincerely,\n Team Finans`, user.email)
                                        else if (sumOfExpenses >= budget * 0.7)
                                            emailAlert("Budget Alert", `Hello there! \n\nThis message is to let you know that you are about to exceed your budget for \"${name}\" for this month, the total amount of expenses is currently $${sumOfExpenses.toFixed(2)}, your budget is $${budget} \n\n Sincerely,\n Team Finans`, user.email)
                                    } else {
                                        console.log("will not email")
                                    }




                                })
                                .catch(error => {
                                    console.log(error)
                                    res.send(error)
                                });



                        })
                        .catch(error => {
                            console.log(error)
                            res.send(error)
                        });


                } else { // if there are errors, extracts messages from validation errors array and send to frontend
                    let errorMessages = [];
                    for (let i of errors) {
                        errorMessages.push(i.msg)
                    }

                    let errorObject = new customError(errorMessages, 422);
                    console.log("validation error sent")
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
            .populate('types')
            .populate({
                path: 'expenses',
                populate: { path: 'type' }
            })
            .exec()
            .then(user => {
                let targetExpense = user.expenses.find(expense => expense._id == req.query.expenseId);//compare with id in query parameter

                //remove targetExpense from user.expenses
                user.expenses.pull(targetExpense);

                let arrayOfExpensesInSameMonth = [...user.expenses];

                //delete all recurring expenses from user.expenses if req.query.option says so
                if (req.query.option == "all" && targetExpense.recurring == true) {
                    for (let i in arrayOfExpensesInSameMonth) {

                        //delete all future recuring expenses
                        if (arrayOfExpensesInSameMonth[i].description == targetExpense.description && ((arrayOfExpensesInSameMonth[i].day > targetExpense.day && arrayOfExpensesInSameMonth[i].month == targetExpense.month) || arrayOfExpensesInSameMonth[i].month > targetExpense.month || arrayOfExpensesInSameMonth[i].year > targetExpense.year)) {
                            //filter out user.expenses[i] from user.expenses
                            user.expenses = user.expenses.filter(expense => expense._id != arrayOfExpensesInSameMonth[i]._id);
                        }
                    }

                }

                user.save()
                targetExpense.type.save()

                //delete from expenses collection
                Expense.deleteOne({ _id: req.query.expenseId }).exec()
                    .then(deletedExpense => {
                        res.send(deletedExpense);

                    })
                    .catch(error => {
                        console.log(error)
                        res.send(error)
                    });

                //delete all recurring expenses from expenses collection if req.query.option says so
                if (req.query.option == 'all' && targetExpense.recurring == true) {
                    Expense.deleteMany({
                        recurring: true, description: targetExpense.description,
                        $or: [
                            { $and: [{ month: { $eq: parseInt(targetExpense.month) } }, { day: { $gt: parseInt(targetExpense.day) } }] },
                            { month: { $gt: parseInt(targetExpense.month) } }

                        ]
                    })

                        .then(results => {

                        })
                        .catch(error => {
                            console.log(error)
                            res.send(error)
                        });

                }

            })
            .catch(error => {
                console.log(error)
                res.send(error)
            });


    } else {
        let errorObject = new customError(['Please log in to delete expense'], 401);
        res.status(errorObject.status).send(errorObject);
    }



}

exports.updateExpense = (req, res) => {

    if (req.session.isAuth) {
        const errors = (validationResult(req)).array();

        if (errors.length < 1) {
            User.findOne({ _id: req.session.userId })
                .populate({
                    path: 'expenses',
                    populate: { path: 'type' }
                })
                .populate('types')
                .exec()
                .then(user => {
                    let targetExpense = user.expenses.find(expense => expense._id == req.body.expenseId);

                    //get current month
                    const current = new Date();
                    const currentMonth = current.getMonth() + 1

                    //if expense to be updated has Null type it means we're dealing with a type that has been deleted. It's a special case. We are not updating from the ExpenseTable component. We need to change their type to "Other"
                    if (targetExpense.type == null) {
                        console.log("received request to update expense with Null type")
                        let typeOther = user.types.find(type => type.name == "Other");
                        console.log("expense is ")
                        console.log(targetExpense)
                        console.log("the new type will be ")
                        console.log(typeOther)
                        targetExpense.type = typeOther //correct expense that needs to be updated
                        targetExpense.save()
                            .then(savedExpense => {
                                //stop right here. We don't need to update anything else
                                res.send(savedExpense)
                                res.end()
                                
                            })

                            return
                    }



                    //Otherwise, proceed to updating the expense below

                    if (req.body.newYear && req.body.newYear != "" && req.body.newYear != targetExpense.year) {
                        console.log("year will be changed")
                        targetExpense.year = req.body.newYear
                        if (targetExpense.recurring == true && req.body.option == "all") {
                            let errorObject = new customError(['You cannnot change the year of recurring all expenses. Please create new ones for a different year'], 422);
                            res.status(errorObject.status).send(errorObject);
                            return
                        }
                    } if (req.body.newMonth && req.body.newMonth != "" && (targetExpense.recurring == false || targetExpense.recurring == true && req.body.option == "one")) {
                        console.log("month will be changed")
                        targetExpense.month = req.body.newMonth
                    } if (req.body.newDay && req.body.newDay != "") {
                        console.log("day will be changed, frequency is: ")
                        console.log(targetExpense.frequency)

                        // to update day of monthly recurring expenses, simply change day for all future ones
                        if (targetExpense.recurring == true && req.body.option == "all") {
                            if (targetExpense.frequency == 'monthly') {
                                targetExpense.day = req.body.newDay
                                Expense.updateMany({
                                    recurring: true, description: targetExpense.description,
                                    month: { $gt: parseInt(targetExpense.month) }
                                }, { day: req.body.newDay })
                                    .then(results => {
                                        console.log("updated many")

                                    }).catch(error => {
                                        console.log(error)
                                        res.send(error)
                                    }
                                    )
                            } else if (targetExpense.frequency == 'bi-weekly' || targetExpense.frequency == 'weekly') {
                                let frequency = targetExpense.frequency == 'bi-weekly' ? 14 : 7

                                updateAll(frequency)

                                async function updateAll(frequency) {
                                    //create date object using req.body.newDay, req.body.newMonth, req.body.newYear
                                    let newStartDate = new Date(req.body.newYear, req.body.newMonth - 1, req.body.newDay)
                                    //clone targetExpense
                                    let targetExpenseClone = JSON.parse(JSON.stringify(targetExpense))

                                    //update targetExpense
                                    targetExpense.day = newStartDate.getDate()
                                    targetExpense.month = newStartDate.getMonth() + 1
                                    targetExpense.year = newStartDate.getFullYear()
                                    //add one week to newStartDate
                                    newStartDate.setDate(newStartDate.getDate() + frequency)

                                    console.log("called updateAll")
                                    for (let i in user.expenses) {
                                        //
                                        if (user.expenses[i].description == targetExpenseClone.description && ((user.expenses[i].day > targetExpenseClone.day && user.expenses[i].month == targetExpenseClone.month) || user.expenses[i].month > targetExpenseClone.month || user.expenses[i].year > targetExpenseClone.year) && user.expenses[i]._id != targetExpenseClone._id) {

                                            await Expense.findOneAndUpdate({ _id: user.expenses[i]._id }, { day: newStartDate.getDate(), month: newStartDate.getMonth() + 1, year: newStartDate.getFullYear() })

                                            //add one week to newStartDate
                                            newStartDate.setDate(newStartDate.getDate() + frequency)
                                        }
                                    }
                                }

                            }

                        } else {
                            targetExpense.day = req.body.newDay
                        }
                    } if (req.body.newAmount && req.body.newAmount != "") {
                        console.log("amount will be changed")
                        targetExpense.amount = req.body.newAmount//change the expense info as well


                        //if changing amount of recurring expenses, edit all future when req.body.option says so first
                        if (req.body.option == 'all' && targetExpense.recurring == true) {
                            Expense.updateMany({
                                recurring: true, description: targetExpense.description,
                                $or: [
                                    { $and: [{ month: { $eq: parseInt(targetExpense.month) } }, { day: { $gt: parseInt(targetExpense.day) } }] },
                                    { month: { $gt: parseInt(targetExpense.month) } }

                                ]
                            }, { amount: req.body.newAmount })
                                .then(results => {
                                    console.log("updated many")
                                }).catch(error => {
                                    console.log(error)
                                    res.send(error)
                                }
                                )
                        }

                    } if (req.body.newDesc && req.body.newDesc != "") {
                        console.log("desc will be changed")

                        //if changing description of recurring expenses, edit all future when req.body.option says so first
                        if (req.body.option == 'all' && targetExpense.recurring == true) {
                            Expense.updateMany({
                                recurring: true, description: targetExpense.description,
                                $or: [
                                    { $and: [{ month: { $eq: parseInt(targetExpense.month) } }, { day: { $gt: parseInt(targetExpense.day) } }] },
                                    { month: { $gt: parseInt(targetExpense.month) } }

                                ]
                            }, { description: req.body.newDesc })
                                .then(results => {
                                    console.log("updated many")
                                }).catch(error => {
                                    console.log(error)
                                    res.send(error)
                                }
                                )
                        }
                        //change selected expense's description
                        targetExpense.description = req.body.newDesc

                    } if (req.body.newTypeId && req.body.newTypeId != "") {
                        console.log("type will be changed")
                        Type.findOne({ _id: req.body.newTypeId._id })//get new type
                            .exec()
                            .then(type => {
                                targetExpense.type = type //change type in the expense info

                                //check for future recurring expenses and change their type too
                                if (req.body.option == 'all' && targetExpense.recurring == true) {
                                    Expense.updateMany({
                                        recurring: true, description: targetExpense.description,
                                        $or: [
                                            { $and: [{ month: { $eq: parseInt(targetExpense.month) } }, { day: { $gt: parseInt(targetExpense.day) } }] },
                                            { month: { $gt: parseInt(targetExpense.month) } }

                                        ]
                                    }, { type: type })
                                        .then(results => {
                                            console.log("updated many")
                                        }).catch(error => {
                                            console.log(error)
                                            res.send(error)
                                        }
                                        )
                                }

                                targetExpense.save() //save expense
                                    .then(savedExpense => {
                                        console.log("sent here")
                                        res.send(savedExpense)
                                    })
                                    .catch(error => {
                                        console.log(error)
                                        res.send(error)
                                    });

                            })

                    } else {
                        console.log("sent there")
                        targetExpense.type.save() //save type
                        targetExpense.save()
                            .then(savedExpense => {
                                res.send(savedExpense)
                            })
                            .catch(error => {
                                console.log(error)
                                res.send(error)
                            });
                    }



                })
                .catch(error => {
                    console.log(error)
                    res.send(error)
                });
        } else {
            let errorMessages = [];
            for (let i of errors) {
                errorMessages.push(i.msg)
            }

            let errorObject = new customError(errorMessages, 422);
            console.log("validation error sent")
            res.status(errorObject.status).send(errorObject);

        }

    } else {
        let errorObject = new customError(['Please log in first'], 401);
        res.status(errorObject.status).send(errorObject);
    }

}
