const Expense = require('../models/Expense.js');
const Type = require('../models/Type.js');

const {validationResult} = require('express-validator');

////gets and array of all expenses
exports.getAllExpenses = (req,res)=>{
    Expense.find({})
    .populate('type')//populate type which holds references to type collection
    .exec()
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
    .populate('type')
    .exec()
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
        results = results.filter(expense => expense.type.name == req.query.type)
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
        
        Type.findOne({"name": req.body.type}).exec()//search for a type with the value passed
        .then(chosenType=>{//after finding a type with the name in the type schema, proceed to create
            let expense = new Expense({
            month:req.body.month,
            day:req.body.day,
            year:req.body.year,
            type:chosenType,//reference to type schema
            description:req.body.desc,
            amount:req.body.amount,
            });
            
            expense.save()
            
            .then(savedExpense=>{
                res.status(201).send(savedExpense);//status 201
            })
            .catch(error=>{
                res.send(error)
            });
        })
        .catch(error=>{
            res.send(error)
          });

    } else { // if there are errors, extracts messages from validation errors array and send to frontend
        let errorMessages = [];
        for(let i of errors) {
            errorMessages.push(i.msg)
        }
        
        class customError extends Error {
          constructor(errorMessages, status, message) {
            super(message);
            this.data = errorMessages;
            this.status = status;
          }
        }
        let errorObject = new customError(errorMessages,422);

        res.status(errorObject.status).send(errorObject);
        
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
