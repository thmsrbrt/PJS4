const DB = require('../models/UtilisateurModel')
const path = require("path"); // prendre les connexions à la BDD correspondantes
const bodyParser = require("body-parser");

exports.findAllUtilisateur = (req, res) => {
    DB.findAllUtilisateurs(res);
}

exports.findUtilisateur = (req, res) => {
    var utilisateur;
    if (req.query.id == null) {
        res.sendFile(path.join(__dirname,'../views/UtilisateurView.html'));
    } else {
        DB.findOneUtilisateurByID(req.query.id, res);
    }
}

exports.addUtilisateurs = (req, res) => {
    const objPOST = req.body;
    if (objPOST.method === "put") { // cas d'une MAJ
        //console.log(objPOST.nom);
        if (objPOST.id === "" || typeof objPOST.id === 'undefined') {
            console.error("erreur pas d'id utilisateur");
            res.status(500).end("Erreur : pas d'id utilisateur !");
        } else {
            var updateString = "";
            if (objPOST.email !== "" || typeof objPOST.email !== 'undefined') {
                if (updateString.length === 0) {
                    updateString += "email = '" + objPOST.email + "'";
                } else {
                    updateString += ", email = '" + objPOST.email + "'";
                }
            }
            if (objPOST.mdp !== "" || typeof objPOST.mdp !== 'undefined') {
                if (updateString.length === 0) {
                    updateString += "MotDePasse = '" + objPOST.mdp + "'";
                } else {
                    updateString += ", MotDePasse = '" + objPOST.mdp + "'";
                }
            }
            if (objPOST.photo !== "" || typeof objPOST.photo !== 'undefined') {
                if (updateString.length === 0) {
                    updateString += "photoprofile = '" + objPOST.photo + "'";
                } else {
                    updateString += ", photoprofile = '" + objPOST.photo + "'";
                }
            }
            if (objPOST.description !== "" || typeof objPOST.description !== 'undefined') {
                if (updateString.length === 0) {
                    updateString += "description = '" + objPOST.description + "'";
                } else {
                    updateString += ", description = '" + objPOST.description + "'";
                }
            }
            if (objPOST.cvfile !== "" || typeof objPOST.cvfile !== 'undefined') {
                if (updateString.length === 0) {
                    updateString += "cvfile = '" + objPOST.cvfile + "'";
                } else {
                    updateString += ", cvfile = '" + objPOST.cvfile + "'";
                }
            }
            console.log(updateString);
            DB.updateUtilisateur(updateString, objPOST.id, res);
            console.log("update réalisé");
        }
    } else { // cas d'une création
        if (typeof objPOST.nom == 'undefined' || objPOST.nom === ''
            || typeof objPOST.prenom == 'undefined' || objPOST.prenom === ''
            || typeof objPOST.email == 'undefined' || objPOST.email === ''
            || typeof objPOST.mdp == 'undefined' || objPOST.mdp === ''
            || typeof objPOST.type == 'undefined' || objPOST.type === '' ) {
            console.error("erreur url");
            res.status(500).send("Erreur au niveau des paramètres de l'URL !");
        } else {
            var fields = "nom, prenom, email, motdepasse, type";
            var val = "?,?,?,?,?";
            var tabVal = [objPOST.nom, objPOST.prenom, objPOST.email, objPOST.mdp, objPOST.type];

            if (typeof objPOST.photo !== 'undefined' || objPOST.photo !== "") {
                fields += ", photoprofile";
                val += ", ?";
                tabVal.push(objPOST.photo);
            }
            if (typeof objPOST.description != 'undefined' || objPOST.description !== "") {
                fields += ", description";
                val += ", ?";
                tabVal.push(objPOST.description);
            }
            if (typeof objPOST.cvfile != 'undefined' || objPOST.cvfile !== "") {
                fields += ", cvfile";
                val += ", ?";
                tabVal.push(objPOST.cvfile);
            }
            DB.createUtilisateur(fields, val, tabVal, res);
        }
    }
}

exports.deleteUtilisateurs = (req, res) => {
    const id = req.params.id;
    DB.deleteUtilisateurById(id, res);
}