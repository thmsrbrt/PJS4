const DB = require('../models/UtilisateurModel')
const path = require("path");
const {createUser, updateUserToken} = require("../models/UtilisateurModel");
const crypto = require("crypto"); // prendre les connexions à la BDD correspondantes

exports.findAllUtilisateur = (req, res) => {
    if (req.user) {
        DB.findAllUtilisateurs(res);
    } else {
        res.status(500).end("pas connecté en session");
    }
}

exports.findUtilisateur = (req, res) => {
    var utilisateur;
    if (req.query.id == null) {
        res.sendFile(path.join(__dirname,'../views/UtilisateurView.html'));
    } else {
        DB.findOneUtilisateurByID(req.query.id, res);
    }
}

exports.findUtilisateurByEmail = (req, res) => {
    console.log(req.query.email);
    DB.findOneUtilisateurByEmail(req.query.email, res);
}

exports.updateUtilisateurs = (req, res) => {
    const objPOST = req.body;
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
        if (objPOST.photoprofile !== "" || typeof objPOST.photoprofile !== 'undefined') {
            if (updateString.length === 0) {
                updateString += "photoprofile = '" + objPOST.photo + "'";
            } else {
                updateString += ", photoprofile = '" + objPOST.photoprofile + "'";
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
}


/**
 * Méthode permettant d'ajouter un utilisateur dans la base
 * @response Code HTTP 500 si erreur
 */
exports.addUtilisateurs = (req, res) => {
    const objPOST = req.body;
    if (objPOST.nom === '' || objPOST.prenom === '' || objPOST.email === '' || objPOST.mdp === '' || objPOST.type === '' || objPOST.photoprofile === '' || objPOST.description === '' ||objPOST.cvfile === '' ) {
        console.error("erreur url");
        res.status(500).send("Erreur au niveau des paramètres de l'URL !");
    } else { // cas optionnel
        var tabVal = [objPOST.nom, objPOST.prenom, objPOST.email, objPOST.mdp, objPOST.type, objPOST.photoprofile, objPOST.description, objPOST.cvfile];
        DB.createUtilisateur(tabVal, res);
    }
}

/**
 * Méthode permettant de supprimer un utilisateur
 */
exports.deleteUtilisateurs = (req, res) => {
    const id = req.params.id;
    req.user.id;
    DB.deleteUtilisateurById(id, res);
}

/**
 * Méthode permettant de vérifier la requête POST de register
 * @response Code HTTP 201 si réussite, 403 dans le cas contraire, avec la raison dans le body ("faillure")
 */
exports.registerHandler = (req, res ) => {
    return (request, res) => {
        const {email, password} = request.body;

        if (!users.find(user => user.email === email)) { // remplacer par une req bdd
            try {
                createUser(["bernard", "sans nom", getHashedPassword(password)])
                res.sendStatus(201)
            } catch (err) {
                res.status(403).json({"faillure": err}).send();
            }
        }
    };
}

/**
 * Méthode permettant de vérifier la requête POST de login
 * @response avec un body si connexion possible, sans sinon
 */
exports.loginHandler = (req, res) => {
    // TODO : vérfier en BDD
    return (request, res) => {
        //console.log(request.body)
        const {email, password} = request.body;
        const date = Date.now();
        //console.log(getHashedPassword(password))

        if (users.find(user => user.email === email && user.password === getHashedPassword(password))) { // remplacer par une req bdd
            const authToken = getToken(email, date);
            updateUserToken(email, authToken, date);
            res.json({"auth": authToken}).send()
            // Avant, mettre le authToken en bdd pour le user concerné
        } else
            res.send();
    };
}


/**
 * Fonction permettant de créer un token d'authentification
 * @param email {string} Email de l'utilisateur
 * @param date {number} Timestamp
 * @returns {string} Le token hashé et en base64 composé d'une random string + email + timestamp
 */
const getToken = (email, date) => {
    return getHashedPassword(crypto.randomBytes(48).toString() + email + date.toString());
}

/**
 * Fonction permettant de transformer une string en un hash sha256 en base64
 * @param password {string} La string à transformer
 * @returns {string} La string hashée et en base 64
 */
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    return sha256.update(password).digest('base64');
}
/**
 * A défaut d'utiliser la bdd, une liste d'objets avec comme attributs une email et un mot de passe hashé
 * @type {[{email: string, password: string}]}
 */
const users = [
    {
        email: 'ghjksd@ghn.fr',
        password: 'p8IJZfm72+lkhaLi3cFO1BPyCQxxwaPq26TqJJrkLWg=', //gfdsJHGF54!()
    },
]
