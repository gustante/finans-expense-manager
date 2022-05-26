const express = require('express');
const app = express();
const connection = require('./db/connection');
const port = process.env.PORT;
const router = require("./routes/index.js")
const session = require('express-session');
const passport = require('passport');
const redis = require("ioredis")



//PASSPORT GOOGLE OAUTH
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIEND_ID,
    clientSecret: process.env.GOOGLE_CLOUD_SECRET,
    callbackURL: "https://finans-prpwmfaewa-uw.a.run.app/api/v1.0/oauth/google/callback",
    passReqToCallback: true
  },
 function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

//END OF PASSPORT FOR GOOGLE OAUTH




//UPSTASH REDIS

let client = new redis(`rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:33178`);

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



