const router = require('express').Router(); 
const expenseRouter = require('./expense.js'); 
const typeRouter = require('./type.js'); 
const oauthRouter = require('./oauth.js'); 

router.use('/expense', expenseRouter)
router.use('/type', typeRouter)
router.use('/oauth/google', oauthRouter)

module.exports = router;