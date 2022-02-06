module.exports = app => {
    const utilisateurController = require('../controllers/UtilisateurController');
    var router = require("express").Router();

    //Contient toutes les routes
    router.get('/utilisateurs', utilisateurController.accueil);
    router.get('/utilisateurs/utilisateur', utilisateurController.findUtilisateur)

    app.use('/', router);
}