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
        cb({erreur : "not_found"}, null);
    });
}

/**
 * Méthode permettant de mettre à jour les informations d'un utilisateur
 * @param data {array<string>} data
 */
export const updateUtilisateur = (data) => {
    db.query('UPDATE utilisateur SET nom=?, prenom=?, email=?, PhotoProfile=?, Description=?, CVFile=? WHERE idUtilisateur = ? ;', data, (err,data) => {
        if (err) {
            throw err;
        }
    });
}

/**
 * Méthode permettant de mettre à jour le token d'un utilisateur
 * @param email {string} email de l'utilisateur
 * @param token {string} token à mettre à jour
 * @param tokenTimeStamp {string} timestamp du token
 */
export const updateUserToken = (email, token, tokenTimeStamp) => {
    db.query('UPDATE utilisateur SET token = ?, tokenTimeStamp = ? WHERE Email = ?;', [token, tokenTimeStamp, email], function (err, data) {
        if (err) throw err;
    });
}

/**
 * Méthode permettant de créer un utilisateur en base de données
 * @param donnees {array<string>} données à insérer
 */
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


export const findPassWordByIdUtilisateur = (id, cb) => {
    db.query('SELECT MotDePasse FROM utilisateur WHERE idUtilisateur = ?', [id], (err, rows) => {
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

/**
 * Méthode permettant de mettre à jour le mot de passe d'un utilisateur
 * @param data {array<string>} données à insérer
 */
export const updatePasswordBDD = (data) => {
    db.query('UPDATE utilisateur SET MotDePasse = ? WHERE idUtilisateur = ?;', data, (err, data) => {
        if (err) {
            throw err;
        }
    });
}