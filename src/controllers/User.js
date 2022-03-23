import {
    createUser,
    findOneUtilisateurByEmailPSD,
    findOneUtilisateurByEmail,
    findOneUtilisateurByID,
    findPassWordByIdUtilisateur,
    updatePasswordBDD,
    updateUtilisateur
} from "../models/User.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {accessTokenSecret} from "../../server.js";

/**
 * Méthode permettant de vérifier la requête POST de login
 * @response avec un body si connexion possible, sans sinon
 */
export const loginHandler = (req, res) => {
    const {email, password} = req.body;
    if (!email || !password)
        return res.sendStatus(401)

    //if (users.find(user => user.email === email && user.password === getHashedPassword(password))) { // remplacer par une req bdd
    findOneUtilisateurByEmailPSD([email, getHashedPassword(password)], (err, data) => {
        if (err) {
            err.erreur === "not_found" ? res.status(404).send({message: 'Utilisateur non trouvé'}) : res.status(403).send({message: "Erreur"});
        } else {
            // const authToken = getToken(email, date);
            // updateUserToken(email, authToken, date);
            const accessToken = jwt.sign({email: data.email}, accessTokenSecret);
            res.json({accessToken}).send()
        }
    })
}

/**
 * Méthode permettant de trouver un utilisateur à partir d'un id
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si user non trouvé et 200 si trouvé
 */
export const findUtilisateur = (req, res) => {
    const idUtilisateur = req.params.idUtilisateur;
    if (idUtilisateur == null)
        res.status(500).send({message: "Erreur, idUser null"});
    else
        findOneUtilisateurByID(idUtilisateur, (err, data) => {
            if (err)
                err.erreur === "not_found" ? res.status(404).send({message: 'Utilisateur non trouvé'}) : res.status(500).send({message: "Erreur"});
            else
                res.status(200).send(data);
        });
}

/**
 * Méthode permettant de vérifier la requête POST de register
 * @response Code HTTP 201 si réussite, 403 dans le cas contraire, avec la raison dans le body ("faillure")
 */
export const registerHandler = (req, res) => {
    const {email, password, nom, prenom} = req.body;
    if (!email || !password || !nom || !prenom)
        return res.sendStatus(401)

    findOneUtilisateurByEmail(email, (err, data) => {
        if (err) {
            if (err.erreur === "not_found") {
                try {
                    createUser([nom, prenom, email, getHashedPassword(password)]);
                    res.sendStatus(200);
                } catch (err) {
                    res.status(403).json({"faillure": err}).send();
                }
            } else {
                res.status(500).send({message: "Erreur"});
            }
        } else {
            res.status(404).send({message: 'Utilisateur déjà existant'})
        }
    });
}

/**
 * Méthode pour mettre à jour les informations d'un utilisateur
 * @param req Request de ExpressJS
 * @param res Response de ExpressJS
 */
export const updateUserData = (req, res) => {
    const {nom, email, photoProfile, idUtilisateur} = req.body;
    let {prenom, description, cvFile} = req.body;

    if (!nom || !email || !photoProfile || !idUtilisateur)
        return res.sendStatus(401)

    if (prenom == null)
        prenom = "null";
    if (description == null)
        description = "null";
    if (cvFile == null)
        cvFile = "null";

    try {
        updateUtilisateur([nom, prenom, email, photoProfile, description, cvFile, idUtilisateur]);
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.status(403).json({"faillure": err}).send();
    }
}

export const updatePassword = (req, res) => {
    const {oldPassword, newPassword, newPassword2, idUtilisateur} = req.body;
    if (!oldPassword || !newPassword || !newPassword2 || !idUtilisateur)
        return res.sendStatus(401)

    findPassWordByIdUtilisateur(idUtilisateur, (err, data) => {
        if (err) {
            err.erreur === "not_found" ? res.status(404).send({message: 'Utilisateur non trouvé'}) : res.status(500).send({message: "Erreur"});
        } else {
            if (data.MotDePasse === getHashedPassword(oldPassword)) {
                if (newPassword === newPassword2) {
                    updatePasswordBDD([getHashedPassword(newPassword), idUtilisateur]);
                    res.sendStatus(201);
                } else {
                    res.status(403).json({"faillure": "Les deux mots de passe ne correspondent pas"}).send();
                }
            } else {
                res.status(403).json({"faillure": "Le mot de passe actuel n'est pas correct"}).send();
            }
        }
    });
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
