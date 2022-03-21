import db from "../../config/connexionBDD.js";


/**
 * Méthode permettant de trouver un utilisateur en fonction de son password et mot de passe
 * @param profil {array<string>} email + password
 * @param cb {callback} traitement du résultat
 */
export const findOneUtilisateurByEmailPSD = (profil, cb) => {
    db.query("SELECT Email FROM utilisateur WHERE Email = ? and MotDePasse = ?;", profil, (err, rows) => {
        if (err) cb(err, null);

        if (rows.length) {
            cb(null, rows[0]);
            return;
        }
        cb({erreur : "not_found"});
    });
}

export const updateUtilisateur = (updateString, id, cb) => {
    db.query('UPDATE utilisateur SET ? WHERE idUtilisateur = ? ;', [updateString, id], function (err, data) {
        if (err) {
            cb(err, null);
            return;
        }
        if (data !== 0) {
            cb(null, rows[0]);
            return;
        }
        cb({erreur : "not_found"});
    });
}

export const updateUserToken = (email, token, tokenTimeStamp) => {
    db.query('UPDATE utilisateur SET token = ?, tokenTimeStamp = ? WHERE Email = ?;', [token, tokenTimeStamp, email], function (err, data) {
        if (err) throw err;
    });
}

// TODO : Doc
export const createUser = (donnees) => {
    db.query('INSERT INTO utilisateur (Nom, Prenom, Email, MotDePasse, PhotoProfile, Type) VALUES (?,?,?,?,"default","user");', donnees, function (err, data) {
        if (err) throw err;
    });
}

/**
 * Méthode permettant de trouver un utilisateur en fonction de son id
 * @param id {Integer} id de l'user
 * @param cb {callback} traitement du résultat
 */
export const findOneUtilisateurByID = (id, cb) => {
    db.query('SELECT idUtilisateur, nom, prenom, email, PhotoProfile, Description, CVFile FROM v_candidat WHERE idUtilisateur = ?', [id], (err, rows) => {
        if (err) {
            console.log(err)
            cb(err, null);
            return;
        }
        if (rows.length) {
            cb(null, rows[0]);
            return;
        }
        cb({erreur: "not_found"});
    });
}
