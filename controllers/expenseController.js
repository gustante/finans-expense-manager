const Expense = require('../models/Expense.js');
const Type = require('../models/Type.js');

const {validationResult} = require('express-validator');
const axios = require('axios');
const querystring = require('querystring');
var twilio = require('twilio');

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
        if ( !response.data.success || response.data.score < 0.80 ) {
            console.log('reCAPTCHA failed');
            errors.push({msg:'reCAPTCHA failed. Score: '+ response.data.score + ", Success: " + response.data.success})
        }
    })    
    .then(()=>{
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

                        //send SMS using twilio confirming expense creation
                        var accountSid = process.env.ACCOUNT_SID; // Your Account SID from www.twilio.com/console
                        var authToken = process.env.AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
                        
                        var client = new twilio(accountSid, authToken);

                        client.messages.create({
                            body: 'A new expense \"'+savedExpense.description+'\" was created',
                            to: '+12368636833',  // Text this number
                            from: '+19197523572' // From a valid Twilio number
                        })
                        .then(message=>{ 
                            console.log('message sent succesfully')
                        })
                        
                })
                .catch(error=>{
                    console.log(error);
                });

            })
            .catch(error=>{
                console.log(error);
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
    })
    

}

////delete expense by id which is passed by thery
exports.deleteExpense = (req,res)=>{
    Expense.deleteOne({_id: req.query.expense}).exec()
    .then(results=>{
        res.send(results);
        
    })
    .catch(error=>res.send(error));
}

exports.updateExpense = (req,res)=>{
    Expense.findOneAndUpdate({"_id":req.body.expenseId}, {type:req.body.newTypeId}, {new: true})
    .exec()
    .then(results=>{
        console.log(results);
        res.send(results);
    })
    .catch(error=>res.send(error));
}
