module.exports = app => {
    const controller = require('../controllers/controllers');
    var router = require("express").Router();

    //Contient toutes les routes
    router.get('/', controller.accueil);

    router.get('/utilisateurs', controller.test)

    app.use('/', router);
}