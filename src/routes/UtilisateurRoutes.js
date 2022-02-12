const {route} = require("express/lib/router");
module.exports = app => {
    const utilisateurController = require('../controllers/UtilisateurController');
    var router = require("express").Router();
    var bodyParser = require('body-parser');


    //Contient toutes les routes
    router.get('/utilisateurs', utilisateurController.findUtilisateur);
    router.get('/utilisateurs/all', utilisateurController.findAllUtilisateur);
    router.post('/utilisateurs', utilisateurController.addUtilisateurs);
    router.delete('/utilisateurs/:id', utilisateurController.deleteUtilisateurs);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use('/', router);
}