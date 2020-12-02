const router = require('express').Router(); 
const expenseRouter = require('./expense.js'); 

router.use('/expense', expenseRouter)

module.exports = router;