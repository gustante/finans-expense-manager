const {check} = require('express-validator');

const validator = require('validator');


exports.expenseValidator = [

    check("month").escape().trim().isInt().withMessage("Please select a month"),
    
    check("day").escape().trim().isInt({ min: 1, max: 31 }).withMessage("Please enter a valid day"),
    
    check("year").escape().trim().isLength({ min: 4, max: 4 }).withMessage("Invalid value for year").isInt().withMessage("Please enter a valid year"),
    
    check("type").escape().trim().isLength({min: 2}).withMessage("Please choose a type"),
    
    check("desc").escape().trim().isLength({min: 1}).withMessage("Please enter a description"),
    
    check("amount").escape().isNumeric().withMessage("Please enter a valid amount. Must be a number. Must not be empty"),
    
]

exports.typeValidator = [
    
    check("name").escape().trim().isLength({min: 2}).withMessage("Please enter a type"),
    
]
    
