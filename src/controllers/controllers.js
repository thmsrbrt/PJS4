const DB = require('../models/models') // prendre les connexions à la BDD correspondantes

exports.accueil = (req, res) => {
    res.send("Bonjour ! Vous êtes sur l'accueil !");
}

exports.test = (req, res) => {
    DB.findAllUtilisateurs(res);
}