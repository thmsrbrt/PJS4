const DB = require('../models/UtilisateurModel')
const path = require("path"); // prendre les connexions à la BDD correspondantes
const bodyParser = require("body-parser");

exports.findAllUtilisateur = (req, res) => {
    DB.findAllUtilisateurs(res);
}

exports.findUtilisateur = (req, res) => {
    if (req.query.id == null) {
        res.sendFile(path.join(__dirname,'../views/UtilisateurView.html'));
    } else {
        DB.findOneUtilisateurByID(req.query.id, res);
    }
}

exports.addUtilisateurs = (req, res) => {
    const objPOST = req.body;
    if (objPOST.nom == null && objPOST.prenom == null && objPOST.email == null && objPOST.mdp == null && objPOST.type == null) {
        console.error("erreur url");
        res.status(500).send("Erreur au niveau des paramètres de l'URL !");
    } else {
        DB.createUtilisateur(req, res);
    }
}