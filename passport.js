const passport = require('passport')

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
