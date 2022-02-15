const connexionController = require("../controllers/ConnexionController");
const passport = require("passport");
const router = require("express").Router();

module.exports = app => {
    require('../../config/connexionGitHub')(app, passport);

    router.get('/', connexionController.accueil);
    router.get('/auth/github', passport.authenticate('github'));
    router.get('/signin/callback', passport.authenticate('github', { failureRedirect: '/failure' }),
        (req, res) => {
            res.redirect('/user');
        });
    router.get('/failure', connexionController.connexionErreur);
    router.get('/logout', connexionController.deconnexion);

    app.use('/user', router);
}