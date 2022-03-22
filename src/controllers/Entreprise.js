import {findEntrepriseByID} from "../models/Entreprise.js";
import crypto from "crypto";

/**
 * Méthode permettant de récupérer une entreprise par son ID
 * @param req R
 * @param res
 */
export const findEntreprise = (req, res) => {
    let idUtilisateur = req.params.idUtilisateur;
    if (idUtilisateur === null) {
        res.status(500).send({message: "id null"});
    } else {
        findEntrepriseByID(idUtilisateur, (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: 'Annonce non trouvée'}): res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    }
}

/**
 * Méthode permettant de créer une entreprise
 * @param req
 * @param res
 */
export const registerEntreprise = (req, res) => {
    const {nom, email, passspnseonse} = req.body;
    try {
        createEntreprise([nom, email, getHashedPassword(password)])
        res.sendStatus(201)
    } catch (err) {
        res.status(403).json({"faillure: creation entreprise": err}).send();
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

