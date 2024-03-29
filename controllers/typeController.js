const Type = require('../models/Type.js');
const User = require('../models/User.js');
const { validationResult } = require('express-validator');
const axios = require('axios');
const querystring = require('querystring');
const customError = require('../customError.js')
require('dotenv').config();

exports.getAllTypes = (req, res) => {
    if (req.session.isAuth) {
        User.findOne({ _id: req.session.userId })
            .select('types')
            .populate('types')
            .exec()
            .then(user => {
                res.send(user.types);

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

exports.updateSumOfExpenses = (req, res) => {
    if (req.session.isAuth) {
        User.findOne({ _id: req.session.userId })
            .populate('types')
            .populate({
                path: 'expenses',
                populate: { path: 'type' }
            })
            .exec()
            .then(user => {
                //to update sumOfExpenses of types
                //get current month
                let currentMonth = new Date().getMonth() + 1;
                for (let type of user.types) {
                    type.sumOfExpenses = 0;

                    for (expense of user.expenses) {
                        if (expense.month == currentMonth && expense.type.name == type.name) {
                            type.sumOfExpenses += expense.amount;

                        }
                    }
                    type.save()
                }

                res.send(user.types);

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

//post new type
exports.postType = (req, res) => {

    if (req.session.isAuth) {
        //validate fields
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
                if (!response.data.success || response.data.score < 0.20) {
                    console.log('reCAPTCHA failed');
                    errors.push({ msg: 'reCAPTCHA failed. Score: ' + response.data.score + ", Success: " + response.data.success })
                }
            })
            .then(() => {
                //if there are not validation errors, create new expense and save it to database
                if (errors.length < 1) {
                    User.findOne({ _id: req.session.userId })
                        .populate('types')
                        .exec()
                        .then(user => {
                            let type = new Type({
                                name: req.body.name,
                                budget: req.body.budget,
                                sumOfExpenses: 0,
                                user: user._id
                            });
                            user.types.push(type)
                            user.save()
                            type.save()
                            res.status(201).send(type);

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

                    res.status(errorObject.status).send(errorObject);

                }
            })
    } else {
        let errorObject = new customError(['Please log in to create type'], 401);
        res.status(errorObject.status).send(errorObject);
    }





}

////delete expense by id which is passed by thery
exports.deleteType = (req, res) => {

    if (req.session.isAuth) {
        User.findOne({ _id: req.session.userId })
            .populate('types')
            .exec()
            .then(user => {
                let targetType = user.types.find(type => type.name == req.query.type);//compare with id in query parameter
                for (let i in user.types) {
                    if (user.types[i] == targetType && targetType.name != 'Other') {
                        user.types.splice(i, 1)
                    }
                }
                console.log("deleted type from user")
                user.save()
            })

        Type.findOne({ name: req.query.type, user: req.session.userId })//delete only types of user that requested
            .exec()//search for a type with the value passed
            .then(chosenType => {//if finds, delete
                if (chosenType != null) {
                    if (chosenType.name != "Other") {//other type cannot be deleted. There has to be at least one type
                        Type.deleteOne({ name: chosenType.name })
                            .exec()
                            .then(deletedType => {
                                console.log("deleted type from types collection")
                                res.send(deletedType);
                            })
                    } else {
                        let errorMessages = [];
                        errorMessages.push(['"Other" type cannot be deleted'])
                        let errorObject = new customError(errorMessages, 422);
                        res.status(errorObject.status).send(errorObject);
                    }
                } else {//if no type is found, or if user tried to delete "Other", send error message
                    let errorMessages = [];
                    errorMessages.push(['Please input correct type you wish to delete from the list'])
                    let errorObject = new customError(errorMessages, 422);

                    res.status(errorObject.status).send(errorObject);
                }

            })
    } else {
        let errorObject = new customError(['Please log in to delete type'], 401);
        res.status(errorObject.status).send(errorObject);
    }



}
exports.updateType = (req, res) => {

    if (req.session.isAuth) {
        const errors = (validationResult(req)).array();

        if (errors.length < 1) {
            User.findOne({ _id: req.session.userId })
                .populate('types')
                .exec()
                .then(user => {
                    let targetType = user.types.find(type => type._id == req.body.typeId);

                    if (req.body.newName && req.body.newName != "") {
                        console.log(" name will be changed")
                        targetType.name = req.body.newName
                    }

                    if (req.body.newBudget && req.body.newBudget != "") {
                        console.log(" budget will be changed")
                        targetType.budget = req.body.newBudget
                    }

                    targetType.save()
                        .then(savedType => {
                            res.send(savedType)
                        })
                })
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
        let errorObject = new customError(['Please log in to update type'], 401);
        res.status(errorObject.status).send(errorObject);
    }



}

