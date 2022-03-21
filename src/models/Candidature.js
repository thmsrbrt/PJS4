import db from "../../config/connexionBDD.js";

/**
 * Méthode permettant de trouver toutes les annonces
 * @param cb {callback} traitement du résultat
 */
export const findAllAnnonce = (cb) => {
    db.query('SELECT idAnnonce, titre, image, Description, nbCandidat, idEntreprise FROM Annonce', (err, rows) => {
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
}

export const findAnnonceByID = (id, cb) => {
    db.query('SELECT * FROM ANNONCE WHERE idAnnonce = ?', [id], (err, row) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }
        if (row) {
            console.log(row[1]);
            cb(null, row);
            return;
        }
        cb({erreur: "not_found"});
    });
}

