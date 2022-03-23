import db from "../../config/connexionBDD.js";

/**
 * Méthode permettant de retourner tous les message d'une conversation
 * @param idConversation {Integer} id de la conversation
 * @param cb {callback} traitement du résultat
 */
export const findAllByIDConversation = (idConversation, cb) => {
    db.query('SELECT * FROM message WHERE idConversation = ?', [idConversation], (err, rows) => {
        if (err) {
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
 * Méthode permettant de creer un message dans une conversation
 * @param donnees {array<string>} données à insérer
 */
export const createMessageByIDConversation = donnees => {
    db.query('INSERT INTO Message (Message, DateEnvoi, idUtilisateur, idConversation) VALUES (?,NOW(),?,?);', donnees, function (err, data) {
        if (err) throw err;
    });
};
