import {
    createConversation,
    findAllByIDAnnonce,
    findAllByIDUtilisateur, findConversationByIdUtilisateurAAndIdUtilisateurB,
} from "../models/Conversation.js";

/**
 * Méthode récupérer toutes les conversations d'un utilisateur à partir de son ID
 * @param req
 * @param res
 */
export const findAllConversationByIDUser = (req, res) => {
    const idUtilisateur = req.params.idUtilisateur;
    if (idUtilisateur === null) {
        res.status(500).send({message: "Erreur, idUtilisateur null"});
    } else {
        findAllByIDUtilisateur(idUtilisateur, (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: 'Conversation non trouvée'}) : res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    }
}

export const findAllConversationByIdAnnonce = (req, res) => {
    const idAnnonce = req.params.idAnnonce;
    if (idAnnonce === null) {
        res.status(500).send({message: "Erreur: idAnnonce null"});
    } else {
        findAllByIDAnnonce(idAnnonce, (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: 'Conversation non trouvée'}) : res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    }
}

export const addToConversationByUtilisateur = (req, res) => {
    const {idUtilisateurCourant, idUtilisateurDestinataire} = req.body;
    let {idAnnonce, libelle} = req.body;
    if (idUtilisateurCourant === null) {
        res.status(500).send({message: "Erreur: idUtilisateurCourant null"});
    }
    if (idUtilisateurDestinataire === null ) {
        res.status(500).send({message: "Erreur: idUtilisateurDestinataire null"});
    }
    if (idAnnonce === null) {
        idAnnonce = "null";
    }
    if (libelle === null) {
        libelle = "";
    }

    findConversationByIdUtilisateurAAndIdUtilisateurB([idUtilisateurCourant, idUtilisateurDestinataire], (err, data) => {
        if (err) {
            if (err.erreur === "not_found") {
                createConversation([idUtilisateurCourant, idUtilisateurDestinataire, idAnnonce, libelle]);
                res.status(200).send({message: 'Créée'});
            } else {
                res.status(500).send({message:"Erreur conversation déja existante"});
            }
        }
    });
}
