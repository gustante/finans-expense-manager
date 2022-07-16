const express = require('express');
const app = express();
const connection = require('./db/connection');
const port = process.env.PORT;
const router = require("./routes/index.js")
const session = require('express-session');
const passport = require('passport');
const redis = require("ioredis")
const { contactFormValidator } = require('./validator.js');
const { validationResult } = require('express-validator');
const { emailAlert } = require('./nodeMailer.js');
const customError = require('./customError.js')


//PASSPORT GOOGLE OAUTH
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIEND_ID,
  clientSecret: process.env.GOOGLE_CLOUD_SECRET,
  callbackURL: "https://finans-prpwmfaewa-uw.a.run.app/api/v1.0/oauth/google/callback",
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

//END OF PASSPORT FOR GOOGLE OAUTH




//UPSTASH REDIS

let client = new redis(process.env.REDIS_PASSWORD);

client.set('foo', 'bar');

var RedisStore = require('connect-redis')(session)

//END OF UPSTASH REDIS

app.use(
  session({
    store: new RedisStore({ client: client }),
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
  passport.authenticate('google', { scope: ['email', 'profile'] }
  ));

app.get('/api/v1.0/oauth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/#/authenticated',
    failureRedirect: '/api/v1.0/oauth/google/authFail'
  })
);


app.use(function (req, res, next) {
  console.log(req.session);
  next();
})





app.post('/api/v1.0/submitContactForm', contactFormValidator, (req, res) => {
  const errors = (validationResult(req)).array();
  if (errors.length > 0) {
    let errorMessages = [];
    for (let i of errors) {
      errorMessages.push(i.msg)
    }

    let errorObject = new customError(errorMessages, 422);
    console.log("validation error sent")
    res.status(errorObject.status).send(errorObject);
    return
  }

  emailAlert("Message received", `Hello ${req.body.firstName}, this is a confirmation email. We have received your feedback and will get back to you as soon as possible.\n\nSincerely,\nTeam Finans`, req.body.email)


  emailAlert("Feedback from finans", `"${req.body.firstName}" left a message for finans: \n\n"${req.body.contactUsTextarea}" \n\nReply to them at: ${req.body.email}`, process.env.PERSONALEMAIL)

  res.send('Done');
  
});

//DB connection. Starts listening once connection is established
connection.once('open', () => {

  console.log('connected to mongoDB');

  const server = app.listen(port, () => {
    console.log('listening on port ' + port);
  });

  app.use("/api/v1.0", router)
});



