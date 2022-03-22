import db from "../../config/connexionBDD.js";

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

export const createMessageByIDConversation = donnees => {
    db.query('INSERT INTO utilisateur (Message, DateEnvoi, idUtilisateur, idConversation) VALUES (?,?,?,?);', donnees, function (err, data) {
        if (err) throw err;
    });
};
