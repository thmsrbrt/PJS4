import db from "../../config/connexionBDD.js";

export const findAllByIDUtilisateur = (idUtilisateur, cb) => {
    db.query('SELECT * FROM conversation WHERE idUtilisateurA = ? OR idUtilisateurB = ?', [idUtilisateur, idUtilisateur], (err, rows) => {
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

export const findAllByIDAnnonce = (idAnnonce, cb) => {
    db.query('SELECT * FROM conversation WHERE idAnnonce = ?;', idAnnonce, (err, rows) => {
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

export const createConversation = (donnees) => {
    console.log(donnees);
    db.query('INSERT INTO conversation (idUtilisateurA, idUtilisateurB, idAnnonce, Libelle) VALUES (?,?,?,?);', (donnees), function (err, data) {
        if (err) throw err;
    });
};
