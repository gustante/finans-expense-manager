const Expense = require('../models/Expense.js');

const {validationResult} = require('express-validator');

////gets and array of all expenses
exports.getAllExpenses = (req,res)=>{

    Expense.find({}).exec()
    .then(results=>{
        res.send(results);
        
    })
    .catch(error=>res.send(error));
}

////search by id
exports.getExpenseById = (req,res)=>{

    Expense.findOne({"_id": req.params.id})
    .exec()
    .then(result=>{
        res.send(result)
    })
    .catch(error=>{
        res.status(404).send(error.message)
    })
}

//search by expenses filter fields
exports.getExpense = (req,res)=>{
    
    Expense.find({})
    .then(results=>{
    
    //gets array of expenses and performs filter according to user inputs
    if(req.query.month != "") {
        results = results.filter(expense => expense.month == req.query.month)
    }
    if(req.query.day != "") {
        results = results.filter(expense => expense.day == req.query.day)
    }
    if(req.query.year != "") {
        results = results.filter(expense => expense.year == req.query.year)
    }
    if(req.query.type != "") {
        results = results.filter(expense => expense.type == req.query.type)
    }
    if(req.query.amount != 0) {
        results = results.filter(expense => expense.amount == req.query.amount)
    }

        res.send(results);
    })
    .catch(error=>res.send(error));
}

//post new expenses
exports.postExpense = (req,res)=>{

//validate fields
const errors = (validationResult(req)).array();

//if there are not validation errors, create new expense and save it to database
if(errors.length < 1){
        let expense = new Expense({
        month:req.body.month,
        day:req.body.day,
        year:req.body.year,
        type:req.body.type,
        description:req.body.desc,
        amount:req.body.amount,
    });
    
    expense.save()
    .then(savedExpense=>{
        res.send(savedExpense);
    })
    .catch(error=>{
        res.send(error)
        
    });
    
    } else { // if there are errors, extracts messages from validation errors array and send to frontend
        let errorMessages = [];
        for(let i of errors) {
            errorMessages.push(i.msg)
        }

        res.send(errorMessages);
        
    }

}

////delete expense by id which is passed by thery
exports.deleteExpense = (req,res)=>{
    Expense.deleteOne({_id: req.query.expense}).exec()
    .then(results=>{
        res.send(results);
        
    })
    .catch(error=>res.send(error));
}
