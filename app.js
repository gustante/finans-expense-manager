const express = require('express');
const app = express();
const connection = require('./db/connection');
const port = process.env.PORT;
const router = require("./routes/index.js")
const session = require('express-session');
const passport = require('passport');
require('./passport')


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());


app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        isAuth: false,
        cookie: { sameSite: 'strict' },
    })

)

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/v1.0/oauth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/api/v1.0/oauth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/#/authenticated',
    failureRedirect: '/api/v1.0/oauth/google/authFail'
  })
);


app.use(function(req,res,next){
    console.log(req.session);
    next();
})


//DB connection. Starts listening once connection is established
connection.once('open', () => {

    console.log('connected to mongoDB');

    const server = app.listen(port, () => {
        console.log('listening on port ' + port);
    });

    app.use("/api/v1.0", router)
});



