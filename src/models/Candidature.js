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
 * @param cb {callback} traitement du résultat
 */
export const getAllCandidatureByIDCandidat = (idCandidat, cb) => {
    db.query('SELECT * FROM candidature WHERE idCandidat = ?', idCandidat, (err, rows) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }
        if (rows.length) {
            cb(null, rows);
            return;
        }
        cb({erreur: "Aucune candidature trouvée pour cette idCandidat"});
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
        if (rows.length) {
            cb(null, rows);
            return;
        }
        cb({erreur: "Aucune candidature trouvée pour cette idAnnonce"}, null);
    });
}
