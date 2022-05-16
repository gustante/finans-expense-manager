const passport = require('passport')

const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIEND_ID,
    clientSecret: process.env.GOOGLE_CLOUD_SECRET,
    callbackURL: "https://8080-cs-1032086385795-default.cs-us-west1-ijlt.cloudshell.dev/api/v1.0/oauth/google/callback",
    //callbackURL: "https://finans-expense-manager.herokuapp.com/api/v1.0/oauth/google/callback",
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

// exports.oauthMiddleware = [
//     function check(req,res,next){
//         console.log("middleware fired")
//          passport.authenticate('google', { scope: [ 'email', 'profile' ] })
//         next()
//     }
//  ]
