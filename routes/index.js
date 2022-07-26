const router = require('express').Router(); 
const expenseRouter = require('./expense.js'); 
const typeRouter = require('./type.js'); 
const oauthRouter = require('./oauth.js'); 
const userRouter = require('./user.js'); 
const plaidRouter = require('./plaid.js'); 

router.use('/expense', expenseRouter)
router.use('/type', typeRouter)
router.use('/oauth/google', oauthRouter)
router.use('/user', userRouter)
router.use('/plaid', plaidRouter)

module.exports = router;