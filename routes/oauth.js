const router = require('express').Router();
const { login, authFail, logout} = require("../controllers/oauthController.js");

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
  }

router.get('/login', isLoggedIn, login),
router.get('/authFail', authFail)
router.get('/logout', isLoggedIn, logout),

module.exports = router;
