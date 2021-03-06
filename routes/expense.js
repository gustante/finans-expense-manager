const router = require('express').Router();

const {getAllExpenses, getExpense, postExpense, deleteExpense, updateExpense} = require("../controllers/expenseController.js");

const {expenseValidator, editExpenseValidator} = require('../validator.js');

router.get('/all', getAllExpenses) ////gets and array of all expenses
//.get('/:id', getExpenseById) //search by id
.get('/', getExpense)//search by expenses filter fields
.post('/', expenseValidator, postExpense) //post new expenses
.delete('/', deleteExpense) ////delete expense by id which is passed by query
.put('/', editExpenseValidator, updateExpense) ////updates expense

module.exports = router;
