import {createMessageByIDConversation, findAllByIDConversation} from "../models/Message.js";
import {
    createConversation,
    findByIdConversation,
    findConversationByIdUtilisateurAAndIdUtilisateurB
} from "../models/Conversation.js";

/**
 * Méthode permettant de renvoyer tout les messages d'une conversation
 * @param req Request vendant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 200 si réussite, 404 message non trouvé, 500 erreurs internes
 */
export const findAllMessageByIDConversation = (req, res) => {
    if (req.params.idConversation === null) {
        res.status(500).send({message: "Erreur, idConversation null"});
    } else {
        findAllByIDConversation(req.params.idConversation, (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: 'Messages non trouvées'}): res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    }
}

/**
 * TODO gérer les erreurs
 * Méthode permettant d'ajouter un message à une conversation
 * @param req Request vendant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 201 si réussite, 403 dans le cas contraire, 500 erreurs internes
 */
export const addMessageToConversationByID = (req, res) => {
    const {message, idConversation, idUtilisateur} = req.body;
    if (idConversation === null) {
        res.status(500).send({message: "Erreur: idconversation null"});
    } else if (idUtilisateur === null) {
        res.status(500).send({message: "Erreur: idUtilisateur null"});
    } else if (message === null) {
        res.status(500).send({message: "Erreur: message null"});
    } else {
        findByIdConversation(idConversation, (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: 'Conversation non trouvée'}) : res.status(500).send({message: "Erreur"});
            } else {
                try {
                    createMessageByIDConversation([message, idUtilisateur, idConversation]);
                    res.status(201).send({message: "création ok"});
                } catch (err) {
                    res.status(403).json({"message fail": err}).send();
                }
            }
        });
    }
}
