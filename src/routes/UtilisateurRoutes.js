const utilisateurController = require('../controllers/UtilisateurController');
const router = require("express").Router();
const bodyParser = require('body-parser');

module.exports = app => {
    // Routes de requêtes sur table Utilisateur (uniquement si connecté)
    router.get('/utilisateurs', utilisateurController.findUtilisateur);
    router.get('/utilisateurs/all', utilisateurController.findAllUtilisateur);
    router.post('/utilisateurs', utilisateurController.addUtilisateurs);
    router.delete('/utilisateurs/:id', utilisateurController.deleteUtilisateurs);

    // test
    router.get('/utilisateurs/email', utilisateurController.findUtilisateurByEmail);

    // pour récupérer les infos dans post
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // pour utiliser le routage
    app.use('/', router);
}