import {createCandidature, getAllCandidatureByIDAnnonce, getAllCandidatureByIDCandidat} from "../models/Candidature.js";

/**
 * Méthode pour créer une candidature
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 201 si réussite, 403 dans le cas contraire, avec la raison dans le body ("faillure")
 */
export const registerCandidature = (req, res) => {
    const { CVFile, LettreMotivation, idCandidat, idAnnonce } = req.body;

    try {
        createCandidature([CVFile, LettreMotivation, idCandidat, idAnnonce]);
        res.sendStatus(201);
    } catch (err) {
        res.status(403).json({"faillure": err}).send();
    }
}
/**
 * Méthode pour récupérer les candidatures d'un candidat
 * @param req Request vendant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 201 si réussite, 403 dans le cas contraire, avec la raison dans le body ("faillure")
 */
export const getCandidatureCandidat = (req, res) => {
    let idCandidat = req.params.idCandidat;
    if (idCandidat == null) {
       res.status(500).send({message: "idCandidat is required"});
    } else {
        getAllCandidatureByIDCandidat([idCandidat], (err, data) => {
            if (err) {
                err.erreur === "Aucune candidature trouvée pour cette idCandidat" ? res.status(404).send({message: 'erreur lors de la récupération des candidatures'}): res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    }
}

/**
 * Méthode pour récupérer les candidatures d'une annonce
 * @param req Request vendant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 201 si réussite, 403 dans le cas contraire, avec la raison dans le body ("faillure")
 */
export const getCandidatureAnnonce = (req, res) => {
    let idAnnonce = req.params.idAnnonce;
    if (idAnnonce == null) {
        res.status(500).send({message: "idAnnonce is required"});
    } else {
        getAllCandidatureByIDAnnonce([idAnnonce], (err, data) => {
            if (err) {
                err.erreur === "Aucune candidature trouvée pour cette idAnnonce" ? res.status(404).send({message: 'erreur lors de la récupération des candidatures'}): res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    }
}