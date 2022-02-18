const {check} = require('express-validator');

exports.expenseValidator = [

    check("month").escape().trim().isInt().withMessage("Please select a month"),
    
    check("day").escape().trim().isInt({ min: 1, max: 31 }).withMessage("Please enter a valid day"),
    
    check("year").escape().trim().isLength({ min: 4, max: 4 }).withMessage("Invalid value for year").isInt().withMessage("Please enter a valid year"),
    
    check("type").escape().unescape().trim().isLength({min: 2}).withMessage("Please choose a type"),
    
    check("desc").escape().unescape().trim().isLength({min: 1}).withMessage("Please enter a description"),
    
    check("amount").escape().isNumeric().withMessage("Please enter a valid amount. Must be a number. Must not be empty"),
    
]

exports.typeValidator = [
    
    check("name").escape().trim().isLength({min: 2}).withMessage("Please enter a type"),
    
]

exports.userValidator = [
    
    check("firstName").escape().trim().isLength({min: 2}).withMessage("Please enter a valid first name"),
    check("lastName").escape().trim().isLength({min: 2}).withMessage("Please enter a valid last name"),
    check("password").escape().trim().isLength({min: 6, max: 20}).withMessage("Please enter a valid password. Minimum 6 and maximum 20 characters"),
    check("email").escape().trim().isEmail().withMessage("Please enter a valid email"),
    check("phoneNumber").escape().trim().isMobilePhone(['en-CA','en-US']).withMessage("Please enter a valid phone (US or CANADIAN)"),
    
]
    
