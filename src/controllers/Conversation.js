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
    const idUtilisateurCourant = req.params.idUtilisateur;
    const {idUtilisateurDestinataire} = req.body;
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

/**
 * Méthode de récupérer/créer une conversation à partir d'un id d'utilisateur
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @Response 200 si la création est un succès, 500 si une erreur interne est survenue, 404 si la conversation est deja existante
 */
export const getConvByUtilisateur = (req, res) => {
    const idUtilisateurCourant = req.params.idUtilisateur;
    const {idUtilisateurDestinataire} = req.body;
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
                    findConversationByIdUtilisateurAAndIdUtilisateurB([idUtilisateurCourant, idUtilisateurDestinataire], (error, conv) => {
                        if (error) {
                            res.status(500).send({message: "Erreur interne"});
                        } else {
                            res.status(200).send(conv);
                        }
                    });
                } else {
                    res.status(404).send({message: "Erreur"});
                }
            }else
                res.status(200).send(data);
        });
    }
}



/**
 * Méthode pour mettre à jour la date de lecture d'une conversation lors d'un clic
 * @param req
 * @param res
 */
export const updateReadConversation = (req, res) => {
    const {idUtilisateur, idConversation} = req.body;
    console.log("idUtilisateur : " + idUtilisateur);
    console.log("idConversation : " + idConversation);
    if (!idUtilisateur || !idConversation)
        res.status(500).send({message: "Erreur: idUtilisateur et/ou idConversation null"});
    else {
        try {
            updateConversationStatus([idUtilisateur, idConversation]);
            res.status(201).send({message: "Mise a jour reussie"});
        } catch (e) {
            res.status(403).send({message: "Erreur: " + e});
        }
    }
}