import {createAnnonce, findAllAnnonce, findAnnonceByID} from "../models/Annonce.js";

/**
 * Méthode pour trouver les informations d'une annonce par son id
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si annonce non trouvé et 200 si trouvé
 */
export const findAnnonce = (req, res) => {
    if (req.params.id === null) {
        res.status(500).send({message: "Erreur, idAnnonce null"});
    } else  {
        findAnnonceByID(req.params.id, (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: 'Annonce non trouvée'}): res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    }
}

/**
 * Méthode pour trouver toutes les annonces des entreprises
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si aucunes annonces trouvées et 200 si trouvé
 */
export const findAllAnnonces = (req, res) => {
    findAllAnnonce((err, data) => {
        if (err) {
            err.erreur === "not_found" ? res.status(404).send({message: 'aucune annonce na été trouvé'}): res.status(500).send({message: "Erreur"});
        } else {
            res.status(200).send(data);
        }
    });
}

/**
 * Méthode pour créer une annonce
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 201 si réussite, 403 dans le cas contraire, avec la raison dans le body ("faillure")
 */
export const registerAnnonce = (req, res) => {
    let image;
    if (req.body.image == null)
        image = req.body.image;
    else
        image = "null";
    const {titre, description, idEntreprise} = req.body;

    try {
        createAnnonce([titre, image, description, idEntreprise]);
        res.sendStatus(201);
    } catch (err) {
        res.status(403).json({"faillure": err}).send();
    }
}