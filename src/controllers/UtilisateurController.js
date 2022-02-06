const DB = require('../models/UtilisateurModel') // prendre les connexions à la BDD correspondantes

exports.accueil = (req, res) => {
    res.send("Bonjour ! Vous êtes sur l'accueil de la table utilisateurs !");
}

exports.findUtilisateur = (req, res) => {
    if (req.query.id == null) {
        DB.findAllUtilisateurs(res);
    } else {
        DB.findOneUtilisateurByID(req.query.id, res);
    }
}