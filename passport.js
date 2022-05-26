const passport = require('passport')

const GoogleStrategy = require('passport-google-oauth2').Strategy;


module.exports = auth = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIEND_ID,
        clientSecret: process.env.GOOGLE_CLOUD_SECRET,
        callbackURL: "https://8081-cs-1032086385795-default.cs-us-west1-ijlt.cloudshell.dev/api/v1.0/oauth/google/callback",
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
}


