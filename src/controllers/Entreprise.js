import {findEntrepriseByID, updateEntrepriseData} from "../models/Entreprise.js";
import crypto from "crypto";

/**
 * Méthode permettant de récupérer une entreprise par son ID
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response code http 200 si réussite, code http 404 si aucune annonce n'est trouvée, code http 500 si erreur interne
 */
export const findEntreprise = (req, res) => {
    const idUtilisateur = req.params.idUtilisateur;
    if (idUtilisateur === null) {
        res.status(500).send({message: "id null"});
    } else {
        findEntrepriseByID(idUtilisateur, (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: 'Annonce non trouvée'}) : res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    }
}

/**
 * Méthode permettant de créer une entreprise
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response code http 201 si réussite, code http 403 si erreur interne
 */
export const registerEntreprise = (req, res) => {
    const {nom, email, passspnseonse} = req.body;
    if (!nom || !email || !passspnseonse) {
        return res.sendStatus(401);
    }
    try {
        createEntreprise([nom, email, getHashedPassword(password)])
        res.sendStatus(201)
    } catch (err) {
        res.status(403).json({"faillure: creation entreprise": err}).send();
    }
}

/**
 * Méthode permettant de mettre à jour une entreprise
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 */
export const updateEntreprise = (req, res) => {
    const idEntreprise = req.params.idUtilisateur;
    const {nom, email, photoProfile} = req.body;

    if (!nom || !email || !photoProfile || !idEntreprise)
        return res.sendStatus(401)

    try {
        updateEntrepriseData([nom, email, photoProfile, idEntreprise]);
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.status(403).json({"faillure": err}).send();
    }
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

