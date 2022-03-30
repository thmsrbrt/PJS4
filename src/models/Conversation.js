import db from "../../config/connexionBDD.js";

/**
 * Méthode permettant de récupérer toutes les conversations d'un utilisateur
 * @param idUtilisateur {int} id de l'utilisateur
 * @param cb {callback} traitement du résultat
 */
export const findAllByIDUtilisateur = (idUtilisateur, cb) => { // SELECT * FROM V_Conversation, message WHERE (V_Conversation.idUtilisateurA = ? OR V_Conversation.idUtilisateurB = ?) AND message.idConversation = V_Conversation.idConversation ORDER BY message.idMessage DESC LIMIT 1
    db.query('SELECT c.*, (SELECT m.idUtilisateur FROM message AS m WHERE m.idConversation = c.idConversation ORDER BY m.idMessage DESC LIMIT 1) as idUtilisateur, (SELECT m.idMessage FROM message AS m WHERE m.idConversation = c.idConversation ORDER BY m.idMessage DESC LIMIT 1) as idMessage, (SELECT m.Message FROM message AS m WHERE m.idConversation = c.idConversation ORDER BY m.idMessage DESC LIMIT 1) as Message, (SELECT m.DateEnvoi FROM message AS m WHERE m.idConversation = c.idConversation ORDER BY m.idMessage DESC LIMIT 1) as DateEnvoi FROM conversation AS c WHERE (c.idUtilisateurA = ? OR c.idUtilisateurB = ?);', [idUtilisateur, idUtilisateur], (err, rows) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }
        if (rows.length) {
            console.log(rows);
            cb(null, rows);
            return;
        }
        cb({erreur: "not_found"});
    });
};

/**
 * Méthode permettant de récupérer toutes les conversations à partir d'un idConversation
 * @param idConversation {int} id de la conversation
 * @param cb {callback} traitement du résultat
 */
export const findByIdConversation = (idConversation, cb) => {
    db.query('SELECT * FROM V_Conversation WHERE idConversation = ?', idConversation, (err, rows) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }
        if (rows.length === 0) {
            cb({erreur: "not_found"});
            return;
        }
        cb(null, rows);
    })
}

/**
 * Méthode permettant de récupérer toutes les conversations à partir d'un idAnnonce
 * @param idAnnonce {int} id de l'annonce
 * @param cb {callback} traitement du résultat
 */
export const findAllByIDAnnonce = (idAnnonce, cb) => {
    db.query('SELECT * FROM V_Conversation WHERE idAnnonce = ?;', idAnnonce, (err, rows) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }
        if (rows.length) {
            cb(null, rows);
            return;
        }
        cb({erreur: "not_found"});
    });
};

/**
 * Méthode permettant de récupérer la conversation entre deux utilisateurs
 * @param data {object} contient les idUtilisateurA et idUtilisateurB
 * @param cb {callback} traitement du résultat
 */
export const findConversationByIdUtilisateurAAndIdUtilisateurB = (data, cb) => {
    let donnees = [...data, ...data];
    db.query('SELECT * FROM Conversation WHERE (idUtilisateurA = ? AND idUtilisateurB= ?) OR (idUtilisateurB = ? and idUtilisateurA = ?);', donnees, (err, data) => {
        if (err) throw err;
        if (data.length > 0) {
            console.log("je suis dans le >0")
            cb({erreur: "deja"}, null);
            return;
        }
        cb({erreur: "not_found"});
    });
}

/**
 * Méthode permettant de créer une conversation
 * @param donnees {object} contient les données de la conversation
 */
export const createConversation = (donnees) => {
    console.log(donnees);
    db.query('INSERT INTO conversation (idUtilisateurA, idUtilisateurB, idAnnonce, Libelle) VALUES (?,?,?,?);', (donnees), function (err, data) {
        if (err) throw err;
    });
};

/**
 * Méthode pour mettre à jour la date de lecture de la conversation de l'utilisateur à aujourd'hui
 * @param donnees
 */
export const updateConversationStatus = donnees => {
    db.query('UPDATE Conversation_track SET read_at = NOW() WHERE idUtilisateur = ? AND idConversation = ?;', (donnees), function (err, data) {
        if (err) throw err;
    });
}