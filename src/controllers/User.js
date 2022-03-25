import {
    createUser,
    findOneUtilisateurByEmail,
    findOneUtilisateurByEmailPSD,
    findOneUtilisateurByID,
    findPassWordByIdUtilisateur,
    getProfilePictureByIdBD,
    updatePasswordBDD,
    updateUtilisateur, updateCVFileUtilisateur, getCVFileUtilisateurBD,
    updateUserDataParamBD,
} from "../models/User.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {accessTokenSecret} from "../../server.js";
import fs from 'fs';



// TODO : hasher les mots de passes
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
            //console.log(data.idUtilisateur)
            const accessToken = jwt.sign({email: data.email, idUtilisateur: data.idUtilisateur}, accessTokenSecret);
            res.json({accessToken, idUtilisateur: data.idUtilisateur}).send()
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
 * Méthode permettant de trouver les infos publiques d'un utilisateur à partir d'un id
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si user non trouvé et 200 si trouvé
 */
export const findUtilisateurPublicInfo = (req, res) => {
    const idUtilisateur = req.params.idUtilisateur;
    if (idUtilisateur == null)
        res.status(500).send({message: "Erreur, idUser null"});
    else
        findOneUtilisateurByID(idUtilisateur, (err, data) => {
            if (err)
                err.erreur === "not_found" ? res.status(404).send({message: 'Utilisateur non trouvé'}) : res.status(500).send({message: "Erreur"});
            else
                res.status(200).send({idUtilisateur:data.idUtilisateur, Prenom:data.Prenom, PhotoProfile: data.PhotoProfile});
        });
}



/**
 * Méthode permettant de trouver la photo de profil de l'utilisateur à partir de son id
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si user non trouvé et 200 si trouvé
 */
export const getProfilePictureById = (req, res) => {
    const idUtilisateur = req.params.idUtilisateur;
    if (idUtilisateur == null)
        res.status(500).send({message: "Erreur, idUtilisateur null"});
    else
        getProfilePictureByIdBD(idUtilisateur, (err, data) => {
            if (err)
                err.erreur === "not_found" ? res.status(404).send({message: 'Utilisateur ou image non trouvée'}) : res.status(500).send({message: "Erreur"});
            else {
                res.sendFile(data.PhotoProfile, {root: '.'})
            }
        })
}


/**
 * Méthode permettant de vérifier la requête POST de register
 * @response Code HTTP 201 si réussite, 403 dans le cas contraire, avec la raison dans le body ("faillure")
 */
export const registerHandler = (req, res) => {
    const {email, password, nom, prenom} = req.body;
    let description = req.body.description;
    if (!email || !password || !nom || !prenom)
        return res.sendStatus(401)
    if (description == null)
        description = "null";
    findOneUtilisateurByEmail(email, (err, data) => {
        if (err) {
            if (err.erreur === "not_found") {
                try {
                    createUser([nom, prenom, email, getHashedPassword(password), description]);
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
 * Méthode permettant d'enregistrer un CV dans la BDD
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 */
export const cvFileHandler = (req, res) => {
    const idUtilisateur = req.body.idutilisateur;
    const file = req.body.cvfile;

    console.log(req.body);
    console.log(idUtilisateur);
    if (!idUtilisateur || !file)
        res.status(500).send({message: "Erreur, idUser or CV null"});
    else {
        try {
            updateCVFileUtilisateur([file, idUtilisateur]);
            console.log("bdd")
            // TODO ne marche pas, le fichier est enregistré mais pas lisible
            fs.writeFileSync(('./public/files/CV/' + crypto.randomBytes(20).toString('hex') + file), (file), 'binary', (err) => {
                if (err)
                    res.status(500).send({message: "Erreur, impossible d'enregistrer le CV"});
            });
            res.sendStatus(201);
        } catch (err) {
            res.status(500).send({message: "Erreur enregistrement CV"});
        }
    }
}

/**
 * Méthode permettant de récupérer un CV d'un utilisateur
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si user non trouvé et 200 si trouvé
 */
export const getCVFileUtilisateur = (req, res) => {
    const idUtilisateur = req.params.idUtilisateur;
    if (!idUtilisateur)
        res.status(500).send({message: "Erreur, idUser null"});
    else {
        getCVFileUtilisateurBD(idUtilisateur, (err, data) => {
            if (err)
                err.erreur === "not_found" ? res.status(404).send({message: 'Utilisateur ou CV non trouvé'}) : res.status(500).send({message: "Erreur"});
            else {
                res.sendFile(data.CVFile,{root:'public/files/CV/'})
            }
        })
    }
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
export const updateUserDataParam = (req, res) => {
    const {champ, valeur} = req.body;
    try {
        updateUserDataParamBD([champ, valeur]);
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

