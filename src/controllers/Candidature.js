import {
    createCandidature, deleteCandidatureModel,
    getAllCandidatureByIDAnnonce,
    getAllCandidatureByIDCandidat, getAllCandidatureNotRefusedByIDAnnonce,
    getCandidatureByIdCandidatAndIdAnnonce, setCandidatureRetenueStateModel
} from "../models/Candidature.js";
import {deleteFavAnnonceModel} from "../models/Annonce.js";

/**
 * Méthode pour créer une candidature
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 201 si réussite, 403 dans le cas contraire, avec la raison dans le body ("faillure")
 */
export const registerCandidature = (req, res) => {
    const {CVFile, LettreMotivation, idCandidat, idAnnonce} = req.body;
    if (!CVFile || !LettreMotivation || !idCandidat || !idAnnonce) {
        return res.sendStatus(401);
    }
    getCandidatureByIdCandidatAndIdAnnonce([idCandidat, idAnnonce], (err, data) => {
        if (data) {
            res.status(403).send("Vous avez déjà postulé à cette annonce");
        }
        else if (err.erreur === "not_found") {
            try {
                createCandidature([CVFile, LettreMotivation, idCandidat, idAnnonce]);
                res.sendStatus(201);
            } catch (err) {
                res.status(403).json({"faillure": err}).send();
            }
        } else {
            res.status(403).send({"faillure": "Erreur lors de la création de la candidature"});
        }
    });
}
/**
 * Méthode pour récupérer les candidatures d'un candidat
 * @param req Request vendant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 201 si réussite, 403 dans le cas contraire, avec la raison dans le body ("faillure")
 */
export const getCandidatureCandidat = (req, res) => {
    const idCandidat = req.params.idUtilisateur;
    if (idCandidat == null) {
        res.status(500).send({message: "idCandidat is required"});
    } else {
        getAllCandidatureByIDCandidat([idCandidat], (err, data) => {
            if (err) {
                res.status(500).send({message: "Erreur"});
            } else {
                // console.log(data)
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
    const idAnnonce = req.params.idAnnonce;
    if (idAnnonce == null) {
        res.status(500).send({message: "idAnnonce is required"});
    } else {
        getAllCandidatureByIDAnnonce([idAnnonce], (err, data) => {
            if (err) {
                res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    }
}

/**
 * Méthode pour récupérer les candidatures non refusées d'une annonce
 * @param req Request vendant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 200 si réussite, 403 dans le cas contraire, avec la raison dans le body ("faillure")
 */
export const getCandidatureNotRefusedAnnonce = (req, res) => {
    const idAnnonce = req.params.idAnnonce;
    if (idAnnonce == null) {
        res.status(500).send({message: "idAnnonce is required"});
    } else {
        getAllCandidatureNotRefusedByIDAnnonce([idAnnonce], (err, data) => {
            if (err) {
                res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    }
}

export const deleteCandidature = (req, res) => {
    const {idCandidature} = req.params;
    if (!idCandidature) {
        console.log("idCandidature is required");
        return res.status(500).send({message: "Erreur, idCandidat = null"});
    }
    try {
        deleteCandidatureModel([idCandidature], (err, data) => {
            if (err) {
                console.log("err", err);
                err.erreur === "not_found" ? res.status(404).send({message: "aucune annonce n'a été supprimée"}) : res.status(500).send({message: "Erreur"});
            } else {
                console.log("Candidature supprimée");
                res.status(200).send(data);
            }
        });
    } catch (err) {
        res.status(500).send({message: "Erreur suppression Annonce"});
    }
}

export const setCandidatureRetenueState = (req, res) => {
    const {idCandidature, idUtilisateur} = req.params;
    const {candidatureNewState} = req.body;

    if (!idCandidature || candidatureNewState === null || (parseInt(candidatureNewState) !== 0 && parseInt(candidatureNewState) !== 1)) {
        console.log("idCandidature or candidatureNewState is required");
        return res.status(500).send({message: "Erreur, idCandidat = null"});
    }
    try {
        setCandidatureRetenueStateModel([candidatureNewState, idCandidature, idUtilisateur], (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: "aucune annonce n'a été supprimée"}) : res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    } catch (err) {
        res.status(500).send({message: "Erreur suppression Annonce"});
    }
}