import db from "../../config/connexionBDD.js";

/**
 * Méthode permettant de créer une candidature
 * @param data {array<string>} - Données à insérer dans la table
 */
export const createCandidature = (data) => {
    db.query('INSERT INTO candidature (CVfile, LettreMotivation, idCandidat, idAnnonce) VALUES (?, ?, ?, ?)', data, (err, res) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}

/**
 * Méthode permettant de récupérer toutes les candidatures par idCandidat
 * @param idCandidat {number} - Id du candidat
 * @param cb {function} traitement du résultat
 */
export const getAllCandidatureByIDCandidat = (idCandidat, cb) => {
    db.query('SELECT * FROM candidature, annonce WHERE candidature.idCandidat = ? AND annonce.idAnnonce = candidature.idAnnonce', idCandidat, (err, rows) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }
        cb(null, rows);
    });
}

/**
 * Méthode permettant de récupérer toutes les candidatures par idAnnonce
 * @param idAnnonce {number} - Id de l'annonce
 * @param cb {callback} traitement du résultat
 */
export const getAllCandidatureByIDAnnonce = (idAnnonce, cb) => {
    db.query('SELECT * FROM candidature WHERE idAnnonce = ?', idAnnonce, (err, rows) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }
        cb(null, rows);
    });
}
/**
 * Méthode permettant de récupérer toutes les candidatures par idAnnonce
 * @param idAnnonce {number} - Id de l'annonce
 * @param cb {callback} traitement du résultat
 */
export const getAllCandidatureNotRefusedByIDAnnonce = (idAnnonce, cb) => {
    db.query('SELECT * FROM candidature WHERE idAnnonce = ? AND retenue != 0', idAnnonce, (err, rows) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }
        cb(null, rows);
    });
}

/**
 * Méthode pour récupérer la candidature à une annonce d'un candidat
 * @param donnees {array<string>} - Données
 * @param cb {callback} traitement du résultat
 */
export const getCandidatureByIdCandidatAndIdAnnonce = (donnees, cb) => {
    db.query('SELECT * FROM candidature WHERE idCandidat = ? and idAnnonce = ?', donnees, (err, rows) => {
        if (err) {
            cb(err, null);
            return;
        }
        if (rows.length) {
            cb(null, rows);
            return;
        }
        cb({erreur: "not_found"}, null);
    });
}

export const deleteCandidatureModel = (idCandidature, cb) => {
    db.query('DELETE FROM candidature WHERE idCandidature = ?', idCandidature, (err, rows) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }

        cb(null, true);
    });
}

export const setCandidatureRetenueStateModel = (data, cb) => {
    db.query('UPDATE candidature SET candidature.retenue = ? WHERE candidature.idCandidature = ? AND candidature.idAnnonce IN (SELECT annonce.idAnnonce FROM annonce WHERE annonce.idEntreprise = ? )', data, (err, rows) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }

        cb(null, true);
    });
}