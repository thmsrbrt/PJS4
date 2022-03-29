import db from "../../config/connexionBDD.js";


/**
 * Méthode permettant de trouver un utilisateur en fonction de son mail et mot de passe
 * @param profil {array<string>} email + password
 * @param cb {callback} traitement du résultat
 */
export const findOneUtilisateurByEmailPSD = (profil, cb) => {
    db.query("SELECT Email, idUtilisateur FROM utilisateur WHERE Email = ? and MotDePasse = ?;", profil, (err, rows) => {
        if (err) {
            cb(err, null);
            return;
        }
        if (rows.length) {
            cb(null, rows[0]);
            return;
        }
        cb({erreur: "not_found"}, null);
    });
}

/**
 * Méthode qui permet d'enregistrer le CV d'un utilisateur
 * @param profil {array<string>} CV file name + idUtilisateur
 */
export const updateCVFileUtilisateur = (profil) => {
    db.query("UPDATE utilisateur SET CVFile = ? WHERE idUtilisateur = ?;", profil, (err) => {
        if (err) throw err;
    });
}

/**
 * Méthode permettant de trouver un utilisateur en fonction de son mail
 * @param profil {array<string>} email
 * @param cb {callback} traitement du résultat
 */
export const findOneUtilisateurByEmail = (profil, cb) => {
    db.query("SELECT Email FROM utilisateur WHERE Email = ?;", profil, (err, row) => {
        if (err) {
            cb(err, null);
            return;
        }
        if (row.length) {
            cb(null, row);
            return;
        }
        cb({erreur: "not_found"}, null);
    });
}

/**
 * Méthode permettant de mettre à jour les informations d'un utilisateur
 * @param data {array<string>} data
 */
export const updateUtilisateur = (data) => {
    db.query('UPDATE utilisateur SET nom=?, prenom=?, email=?, PhotoProfile=?, Description=?, CVFile=? WHERE idUtilisateur = ? ;', data, (err, data) => {
        if (err) {
            throw err;
        }
    });
}

export const updateUserDataParamBD = (data) => {
    db.query("update utilisateur set ?=? WHERE idUtilisateur = ?;", data, (err, data) => {
        if (err) {
            throw err;
        }
    });
}

export const updateUserProfilePictureDB = (data) => {
    db.query("update utilisateur set PhotoProfile=? WHERE idUtilisateur = ?;", data, (err, data) => {
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
    db.query('INSERT INTO utilisateur (Nom, Prenom, Email, MotDePasse, Description, PhotoProfile, Type) VALUES (?,?,?,?,?,"default.png","candidat");', donnees, function (err, data) {
        if (err) throw err;
    });
}



/**
 * Méthode permettant de trouver un utilisateur en fonction de son id
 * @param id {Integer} id de l'user
 * @param cb {callback} traitement du résultat
 */
export const findOneUtilisateurByID = (id, cb) => {
    db.query('SELECT idUtilisateur, nom, prenom, email, PhotoProfile, Description, CVFile, Type, (SELECT COUNT(*) FROM v_conversation vc WHERE stateMessage = 1 AND vc.idUtilisateur = ?) AS nbMsg FROM Utilisateur WHERE idUtilisateur = ?;', [id, id], (err, rows) => {
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

export const getProfilePictureByIdBD = (id, cb) => {
    db.query('SELECT PhotoProfile FROM utilisateur WHERE idUtilisateur = ?', [id], (err, rows) => {
        if (err) {
            console.log(err);
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
 * Méthode permettant de retourner le CV d'un utilisateur dans la BDD
 * @param id {Integer} id de l'utilisateur
 * @param cb {callback} traitement du résultat
 */
export const getCVFileUtilisateurBD = (id, cb) => {
    db.query('SELECT CVFile FROM utilisateur WHERE idUtilisateur = ?', [id], (err, rows) => {
        if (err) {
            console.log(err);
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