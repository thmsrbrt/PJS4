const utilisateurController = require('../controllers/UtilisateurController');
const router = require("express").Router();
const bodyParser = require('body-parser');
const {registerHandler, loginHandler} = require("../controllers/UtilisateurController");

module.exports = app => {
    // Routes de requêtes sur table Utilisateur (uniquement si connecté)
    router.get('/users', utilisateurController.findUtilisateur);
    router.get('/users/all', utilisateurController.findAllUtilisateur);
    router.post('/users', utilisateurController.addUtilisateurs);
    router.put('/users', utilisateurController.updateUtilisateurs);
    router.delete('/users/:id', utilisateurController.deleteUtilisateurs);

    // pour récupérer les infos dans post
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // pour utiliser le routage
    app.use('/', router);


    app.post("/login", loginHandler)
    app.post("/register", registerHandler)

}