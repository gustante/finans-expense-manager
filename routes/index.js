const router = require('express').Router(); 
const expenseRouter = require('./expense.js'); 
const typeRouter = require('./type.js'); 

router.use('/expense', expenseRouter)
router.use('/type', typeRouter)

module.exports = router;