const utilisateurController = require('../controllers/UtilisateurController');
const router = require("express").Router();
const bodyParser = require('body-parser');

module.exports = app => {
    // Routes de requêtes sur table Utilisateur (uniquement si connecté)
    router.get('/users', utilisateurController.findUtilisateur);
    router.get('/users/all', utilisateurController.findAllUtilisateur);
    router.post('/users', utilisateurController.addUtilisateurs);
    router.delete('/users/:id', utilisateurController.deleteUtilisateurs);

    // test
    router.get('/users/email', utilisateurController.findUtilisateurByEmail);

    // pour récupérer les infos dans post
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // pour utiliser le routage
    app.use('/dev', router);
}