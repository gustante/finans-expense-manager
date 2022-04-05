const {check, body} = require('express-validator');

exports.expenseValidator = [

    check("month").escape().trim().isInt().withMessage("Please select a month"),

    check("day").escape().trim().isInt({ min: 1, max: 31 }).withMessage("Please enter a valid day"),

    check("year").escape().trim().isLength({ min: 4, max: 4 }).withMessage("Please enter a valid year").isInt().withMessage("Please enter a valid year"),

    check("type").escape().unescape().trim().isLength({min: 2}).withMessage("Please choose a type"),

    check("desc").escape().unescape().trim().isLength({min: 1}).withMessage("Please enter a description"),

    check("amount").escape().isNumeric().withMessage("Please enter a valid amount. Must be a number. Must not be empty"),

]

exports.typeValidator = [

    check("name").escape().trim().isLength({min: 1}).withMessage("Please enter a valid type"),
    check("budget").optional({checkFalsy: true}).trim().escape().isNumeric().withMessage("Please enter a number for budget")


]

exports.typeUpdateValidator = [
    check("newName").optional({checkFalsy: true}).escape().trim().isLength({min: 1}).withMessage("Please enter a valid type"),
    check("newBudget").optional({checkFalsy: true}).trim().escape().isNumeric().withMessage("Please enter a number for budget")
]

exports.userRegisterValidator = [

    check("firstName").escape().trim().isLength({min: 2}).withMessage("Please enter a valid first name"),
    check("lastName").escape().trim().isLength({min: 2}).withMessage("Please enter a valid last name"),
    check("password").escape().trim().isLength({min: 6, max: 20}).withMessage("Please enter a valid password. Minimum 6 and maximum 20 characters"),
    check("email").escape().trim().isEmail().withMessage("Please enter a valid email"),
    check("phoneNumber").optional({checkFalsy: true}).escape().trim().isMobilePhone(['en-CA','en-US']).withMessage("Please enter a valid phone number (US or CANADIAN)"),

]

exports.userLoginValidator = [
    check("password").escape().trim(),
    check("email").escape().trim().isEmail().withMessage("Please enter a valid email"),

]

exports.userUpdateValidator = [

    check("firstName").optional({checkFalsy: true}).escape().trim().isLength({min: 2}).withMessage("Please enter a valid first name"),
    check("lastName").optional({checkFalsy: true}).escape().trim().isLength({min: 2}).withMessage("Please enter a valid last name"),
    check("email").optional({checkFalsy: true}).escape().trim().isEmail().withMessage("Please enter a valid email"),
    check("phoneNumber").optional({checkFalsy: true}).escape().trim().isMobilePhone(['en-CA','en-US']).withMessage("Please enter a valid phone number (US or CANADIAN)"),
    check("oldPassword").optional({checkFalsy: true}).escape().trim(),
    check("newPassword").optional({checkFalsy: true}).escape().trim().isLength({min: 6, max: 20}).withMessage("Please enter a valid password. Minimum 6 and maximum 20 characters"),
    check("repeatNewPassword").optional({checkFalsy: true}).escape().trim().isLength({min: 6, max: 20}).withMessage("Please enter a valid password. Minimum 6 and maximum 20 characters")

]

exports.editExpenseValidator = [
    check("newMonth").optional({checkFalsy: true}).escape().trim().isInt({ min: 1, max: 12 }).withMessage("Please select a valid month"),
    check("newDay").optional({checkFalsy: true}).escape().trim().isInt({ min: 1, max: 31 }).withMessage("Please enter a valid day"),
    check("newYear").optional({checkFalsy: true}).escape().trim().isLength({ min: 4, max: 4 }).withMessage("Please enter a valid year").isInt().withMessage("Please enter a valid year"),
    check("newType").optional({checkFalsy: true}).escape().unescape().trim().isLength({min: 2}).withMessage("Please choose a type"),
    check("newDesc").optional({checkFalsy: true}).escape().unescape().trim().isLength({min: 1}).withMessage("Please enter a description"),
    check("newAmount").optional({checkFalsy: true}).escape().isNumeric().withMessage("Please enter a valid amount"),
]

