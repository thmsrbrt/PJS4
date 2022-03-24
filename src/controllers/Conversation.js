import {
    createConversation,
    findAllByIDAnnonce,
    findAllByIDUtilisateur,
    findConversationByIdUtilisateurAAndIdUtilisateurB,
} from "../models/Conversation.js";

/**
 * Méthode récupérer toutes les conversations d'un utilisateur à partir de son ID
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @Response 200 si la requête est un succès, 404 si la conversation n'existe pas, 500 si une erreur interne est survenue
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

/**
 * Méthode récupérer toutes les conversations à partir de l'ID de l'annonce
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @Response 200 si la requête est un succès, 404 si la conversation n'existe pas, 500 si une erreur interne est survenue
 */
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
//TODO : lors de la création d'une conversation on met à jour read_at
/**
 * Méthode qui
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @Response 200 si la création est un succès, 500 si une erreur interne est survenue, 404 si la conversation est deja existante
 */
export const addToConversationByUtilisateur = (req, res) => {
    const {idUtilisateurCourant, idUtilisateurDestinataire} = req.body;
    let {idAnnonce, libelle} = req.body;
    if (idUtilisateurCourant === null) {
        res.status(500).send({message: "Erreur: idUtilisateurCourant null"});
    } else if (idUtilisateurDestinataire === null) {
        res.status(500).send({message: "Erreur: idUtilisateurDestinataire null"});
    } else {
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
                    res.status(404).send({message: "Erreur conversation déja existante"});
                }
            }
        });
    }
}
