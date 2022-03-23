import {createAnnonce, findAllAnnonce, findAnnonceByID, updateAnnonceData} from "../models/Annonce.js";

/**
 * Méthode pour trouver les informations d'une annonce par son id
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si annonce non trouvé et 200 si trouvé
 */
export const findAnnonce = (req, res) => {
    const idUtilisateur = req.params.idUtilisateur;
    if (idUtilisateur === null) {
        res.status(500).send({message: "Erreur, idAnnonce null"});
    } else {
        findAnnonceByID(idUtilisateur, (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: 'Annonce non trouvée'}) : res.status(500).send({message: "Erreur"});
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
            err.erreur === "not_found" ? res.status(404).send({message: 'aucune annonce na été trouvé'}) : res.status(500).send({message: "Erreur"});
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
    const {titre, description, idEntreprise, localisation} = req.body;
    if(!titre || !description || !idEntreprise || !localisation)
        return res.sendStatus(401)

    let image=  req.body.image;
    if (image === null)
        image = "null";

    try {
        createAnnonce([titre, image, description, idEntreprise, localisation]);
        res.sendStatus(201);
    } catch (err) {
        res.status(403).json({"faillure": err}).send();
    }
}

/**
 * Méthode pour mettre à jour une annonce
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 */
export const updateAnnonce = (req, res) => {
    const {titre, description, localisation, idAnnonce} = req.body;
    if(!titre || !description || !localisation || !idAnnonce)
        return res.sendStatus(401)

    let image = req.body;
    if (image == null)
        image = "null";

    try {
        updateAnnonceData([titre, image, description, localisation, idAnnonce]);
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.status(403).json({"faillure": err}).send();
    }
}

export const nbCandidatByIdAnnonce = (req, res) => {

}