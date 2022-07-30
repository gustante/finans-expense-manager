const session = require('express-session');
const User = require('../models/User.js');
const Type = require('../models/Type.js');
const Expense = require('../models/Expense.js');
const { validationResult } = require('express-validator');
const axios = require('axios');
const querystring = require('querystring');
const customError = require('../customError.js')
require('dotenv').config();
const { emailAlert } = require('../nodeMailer.js');

exports.createUser = (req, res) => {
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
            if (!response.data.success || response.data.score < 0.2) {
                console.log('reCAPTCHA failed');
                errors.push({ msg: 'reCAPTCHA failed. Score: ' + response.data.score + ", Success: " + response.data.success })
            }
        })
        .then(() => {
            //if there are not validation errors, create new user and save it to database
            let password;
            if (req.body.googleUser == true) { //store id from google as password if authenticated with google
                password = req.user.id
            } else {
                password = req.body.password
            }

            if (errors.length < 1) {
                let user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: password,
                    phoneNumber: req.body.phoneNumber,
                    lastLoginMonth: req.body.currentMonth,
                    lastLoginYear: req.body.currentYear,
                    googleUser: req.body.googleUser
                });

                let type = new Type({
                    name: 'Other',
                    user: user._id,
                    budget: null,
                    sumOfExpenses: 0,
                });

                user.types.push(type)//every new user starts with a "Other" type.
                type.save()
                if (user.phoneNumber == null) {
                    console.log("changing number")
                    user.phoneNumber = ""
                }

                user.save()
                    .then(() => {
                        console.log("user created succesfully")
                        user.password = "shhhhhh"
                        res.status(201).send(user);//status 201
                    })
                    .catch(error => {
                        console.log(error)
                        console.log("user already existes")
                        res.status(422).send(error);

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
        .catch(error => {
            console.log(error)
            res.send(error)

        });
}

exports.login = (req, res) => {
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
                console.log('reCAPTCHA failed');
                //errors.push({ msg: 'reCAPTCHA failed. Score: ' + response.data.score + ", Success: " + response.data.success })

                let rError = new customError(['reCAPTCHA failed', 'Score: ' + response.data.score], 401)
                res.status(rError.status).send(rError);
            }
        })
        .then(() => {
            if (errors.length < 1) {
                User.findOne({ email: req.body.email })
                    .populate('types')
                    .populate({
                        path: 'expenses',
                        populate: { path: 'type' }
                    })
                    .exec()
                    .then(user => {
                        if (user == null) {
                            throw new customError(['User not found'], 401)
                        }
                        else if (req.body.password == user.password || req.body.googleUser == true) {//no need to check password for google auth, already authenticated
                            //reset budget if detects new month
                            if (req.body.currentMonth > user.lastLoginMonth || req.body.currentYear > user.lastLoginYear) {

                                for (type of user.types) {
                                    type.sumOfExpenses = 0;
                                    //adjusts sumOfExpenses
                                    for (expense of user.expenses) {
                                        if (expense.month == req.body.currentMonth && expense.type.name == type.name) {
                                            type.sumOfExpenses += expense.amount;

                                        }
                                    }
                                    type.save();
                                }
                                user.lastLoginMonth = req.body.currentMonth;//update last login
                                user.lastLoginYear = req.body.currentYear
                                user.save()
                                    .then(savedUser => {
                                        savedUser.password = "shhhh";
                                        req.session.userId = user._id;
                                        req.session.isAuth = true;
                                        res.send(savedUser)
                                    })
                                    .catch(error => {
                                        console.log(error)
                                        res.status(error.status).send(error);
                                    });

                            } else {
                                user.password = "shhhh";
                                req.session.userId = user._id;
                                req.session.isAuth = true;
                                res.send(user);
                            }
                        } else if (req.body.password != user.password) {
                            throw new customError(['Password is incorrect'], 401)
                        }

                    })
                    .catch(error => {
                        console.log(error)
                        res.status(error.status).send(error);
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



}

exports.logout = (req, res) => {

    try {
        if (req.session.isAuth) {
            req.session.userId = null;
            req.session.isAuth = false;
            req.session.destroy()
            res.status(200).send('logged out');
        } else {
            throw new customError(['Unable to log out. User not logged in'], 401)
        }
    } catch (error) {
        console.log(error)
        res.status(error.status).send(error);
    }

}

exports.verifyAuth = (req, res) => {
    try {
        if (req.session.isAuth) {
            User.findOne({ _id: req.session.userId })
                .exec()
                .then(user => {
                    user.password = ""
                    res.send(user)
                })

        } else {
            throw new customError(['User not logged in'], 401)
        }
    } catch (error) {
        console.log(error)
        res.status(error.status).send(error);
    }

}

exports.getNoOfExpenses = (req, res) => {
    if (req.session.isAuth) {
        User.findOne({ _id: req.session.userId })
            .select('expenses')//don't send user password
            .exec()
            .then(user => {
                res.send(user);
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


exports.updateUser = (req, res) => {
    if (req.session.isAuth) {
        const errors = (validationResult(req)).array();



        if (errors.length < 1) {

            User.findOne({ _id: req.session.userId })
                .populate({
                    path: 'expenses',
                    populate: { path: 'type' }
                })
                .exec()
                .then(user => {

                    if (req.body.oldPassword && req.body.oldPassword != user.password) {
                        throw new customError(['Old password is incorrect'], 403)
                    } else if (req.body.newPassword != req.body.repeatNewPassword) {
                        throw new customError(['Passwords don\'t match'], 403)
                    } else if (req.body.newPassword && req.body.newPassword != "") {
                        console.log("password will be changed")

                        emailAlert("User information update", `Hello ${user.firstName},\n\nThis message is to inform you that there has been an update in your account details in our system. Your password was changed to "${req.body.newPassword}". If this was not you, please click the link below to log in to your account and change your password. \n\n https://finans-prpwmfaewa-uw.a.run.app/#/login\n\nSincerely,\nTeam Finans`, user.email)
                        
                        user.password = req.body.newPassword
                    }

                    if (req.body.firstName && req.body.firstName != "" && req.body.firstName != user.firstName) {
                        console.log("first name will be changed")

                        emailAlert("User information update", `Hello ${user.firstName},\n\nThis message is to inform you that there has been an update in your account details in our system. Your first name was changed. If this was not you, please click the link below to log in to your account and change your password. \n\n https://finans-prpwmfaewa-uw.a.run.app/#/login\n\nSincerely,\nTeam Finans`, user.email)

                        user.firstName = req.body.firstName
                        
                    }
                    if (req.body.lastName && req.body.lastName != "" && req.body.lastName != user.lastName) {
                        console.log("last name will be changed")

                        emailAlert("User information update", `Hello ${user.firstName},\n\nThis message is to inform you that there has been an update in your account details in our system. Your last name was changed. If this was not you, please click the link below to log in to your account and change your password. \n\n https://finans-prpwmfaewa-uw.a.run.app/#/login\n\nSincerely,\nTeam Finans`, user.email)

                        user.lastName = req.body.lastName
                    }
                    if (req.body.email && req.body.email != "" && req.body.email != user.email) {
                        console.log("email will be changed")

                        emailAlert("User information update", `Hello ${user.firstName},\n\nThis message is to inform you that there has been an update in your account details in our system. Your email was changed to "${req.body.email}". If this was not you, please click the link below to log in to your account and change your password. \n\n https://finans-prpwmfaewa-uw.a.run.app/#/login\n\nSincerely,\nTeam Finans`, user.email)

                        user.email = req.body.email
                    }
                    if (req.body.phoneNumber || req.body.phoneNumber == "" && req.body.phoneNumber != user.phoneNumber) {//user can leave phonNumber empty, not required
                        console.log("phone number will be changed")

                        emailAlert("User information update", `Hello ${user.firstName},\n\nThis message is to inform you that there has been an update in your account details in our system. Your phone number was changed. If this was not you, please click the link below to log in to your account and change your password. \n\n https://finans-prpwmfaewa-uw.a.run.app/#/login\n\nSincerely,\nTeam Finans`, user.email)

                        user.phoneNumber = req.body.phoneNumber
                    }


                    user.save()
                        .then(savedUser => {
                            savedUser.password = ""
                            res.send(savedUser)
                        })


                })
                .catch(error => {
                    console.log(error)
                    res.status(error.status).send(error)
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


exports.deleteUser = async (req, res) => {

    try {
        if (req.session.isAuth) {
            let deleteUser = await User.findByIdAndDelete(req.session.userId).exec()
            let deleteExpenses = await Expense.deleteMany({ user: req.session.userId }).exec()
            let deleteTypes = await Type.deleteMany({ user: req.session.userId }).exec()
            let accessToken = await AccessToken.deleteMany({ userId: req.session.userId }).exec()
            req.session.destroy()
            res.send("ok")

        } else {
            throw new customError(['Unable to log out. User not logged in'], 401)
        }
    } catch (error) {
        console.log(error)
        res.status(error.status).send(error);
    }

    // if (req.session.isAuth) {
    //     User.findByIdAndDelete(req.session.userId)
    //         .exec()
    //         .then(results => {
    //             console.log('deleting user:')
    //             console.log(results)
    //         })
    //         .catch(error => {
    //             console.log(error)
    //             res.send(error)
    //         });
    //     Expense.deleteMany({ user: req.session.userId})
    //         .exec()
    //         .then(results => {
    //             console.log('deleting expenses:')
    //             console.log(results)
    //         })
    //         .catch(error => {
    //             console.log(error)
    //             res.send(error)
    //         });
    //     Type.deleteMany({ user: req.session.userId})
    //         .exec()
    //         .then(results => {
    //             console.log('deleting types:')
    //             console.log(results)
    //         })
    //         .catch(error => {
    //             console.log(error)
    //             res.send(error)
    //         });
    //          res.send("ok. Deleted")
    // } else {
    //     let errorObject = new customError(['Please log in to see this information'], 401);
    //     res.status(errorObject.status).send(errorObject);
    // }



}
