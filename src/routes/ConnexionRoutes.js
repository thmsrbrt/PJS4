const connexionController = require("../controllers/ConnexionController");
const passport = require("passport");
const router = require("express").Router();

module.exports = app => {
    require('../../config/connexionGitHub')(app, passport);
    require('../../config/connexionFacebook')(passport);

    router.get('/', connexionController.accueil);
    router.get('/login/github', passport.authenticate('github'));
    router.get('/signin/github/callback', passport.authenticate('github', { failureRedirect: '/failure' }),
        (req, res) => {
            res.redirect('/user');
        });
    router.get('/signin', connexionController.connexion);
    router.get('/failure', connexionController.connexionErreur);
    router.get('/logout', connexionController.deconnexion);

    //facebook
    router.get('/login/facebook', passport.authenticate('facebook', {
        scope: [ 'email', 'user_location' ]
    }));
    router.get('/signin/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/failure', failureMessage: true }),
        function(req, res) {
            res.redirect('/');
        });
    app.use('/user', router);

}