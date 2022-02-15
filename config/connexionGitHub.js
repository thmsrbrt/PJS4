const GitHubStrategy = require('passport-github2').Strategy;
const session = require("express-session");
const DB = require('../src/models/UtilisateurModel');

module.exports = (app, passport) => {
    // initialisation
    app.use(passport.initialize());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized:true,
        resave: false
    }));
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((id, done) => {
        done(null, id);
    })

    passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/user/signin/callback",
            scope: 'user:email'
        },
        (accessToken, refreshToken, profile, done) => {
            //return DB.findOneUtilisateurByEmail(profile, done);
            //return done(null, profile);
            return done(null, {name: profile.displayName, id: profile.id, email: profile._json.email, mdp: profile.mdp});
        }
    ));
}