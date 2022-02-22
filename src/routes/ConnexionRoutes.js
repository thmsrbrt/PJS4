const connexionController = require("../controllers/ConnexionController");
const passport = require("passport");
const router = require("express").Router();
const bodyParser = require('body-parser')
//const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = app => {
    require('../../config/connexionGitHub')(app, passport);
    require('../../config/connexionFacebook')(passport);

    router.get('/', connexionController.accueil);
    router.get('/login/github', passport.authenticate('github'));
    router.get('/signin/github/callback', passport.authenticate('github', { failureRedirect: '/failure' }),
        (req, res) => {
            res.redirect('/user');
        });
    router.post('/signin', urlencodedParser, connexionController.connexion);
    router.get('/failure', connexionController.connexionErreur);
    router.get('/logout', connexionController.deconnexion);

    //facebook
    router.get('/login/facebook', passport.authenticate('facebook', {
        scope: [ 'email', 'user_location' ]
    }));
    router.get('/signin/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/failure', failureMessage: true}),
        function(req, res) {
            res.redirect('/#_=_');
        });
    app.use('/user', router);

}