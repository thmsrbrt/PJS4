import db from "../../config/connexionBDD.js";

export const createCandidature = (data) => {
    db.query('INSERT INTO candidature (CVfile, LettreMotivation, idCandidat, idAnnonce) VALUES (?, ?, ?, ?)', data, (err, res) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}

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
