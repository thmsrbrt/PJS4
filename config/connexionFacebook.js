const DB = require('../src/models/UtilisateurModel');
var FacebookStrategy = require('passport-facebook');
module.exports = passport => {
    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL:  'http://localhost:3000/user/signin/facebook/callback',
            profileFields: ['emails', 'displayName','name']
        },

        (accessToken, refreshToken, profile, cb) => {
            console.log(profile._json);
            return DB.findOneUtilisateurByEmail(profile._json.email, profile._json.last_name,profile._json.first_name, cb, accessToken);
        }
    ));
}