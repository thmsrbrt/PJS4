import db from "../../config/connexionBDD.js";

/**
 * Méthode permettant de trouver toutes les annonces
 * @param cb {callback} traitement du résultat
 */
export const findAllAnnonce = (cb) => {
    db.query('SELECT A.idAnnonce, A.titre, A.image, A.Description, A.idEntreprise, COUNT(C.idCandidature) AS NbCandidat FROM Annonce A LEFT JOIN Candidature C ON A.idAnnonce = C.idannonce GROUP BY A.idAnnonce', (err, rows) => {
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

/**
 * Méthode permettant de récuppérer une annonce par id
 * @param id idAnnonce
 * @param cb {callback} traitement du résultat
 */
export const findAnnonceByID = (id, cb) => {
    db.query('SELECT A.idAnnonce, A.titre, A.image, A.Description, A.idEntreprise, COUNT(C.idCandidature) AS NbCandidat FROM Annonce A LEFT JOIN Candidature C ON A.idAnnonce = C.idannonce WHERE A.idAnnonce = ? GROUP BY A.idAnnonce', [id], (err, row) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }
        if (row) {
            cb(null, row[0]);
            return;
        }
        cb({erreur: "not_found"});
    });
}

/**
 * Méthode permettant de créer une annonce
 * @param data {array<string>} contenant les données de l'annonce
 */
export const createAnnonce = (data) => {
    db.query('INSERT INTO annonce (titre, image, description, idEntreprise, nbCandidat, datePublication, localisation) VALUES (?,?,?,?,0, NOW(), ?)', data, (err, res) => {
        if (err) {
            throw err;
        }
    });
}

/**
 * Méthode permettant de mettre à jour une annonce
 * @param data {array<string>} contenant les données de l'annonce
 */
export const updateAnnonceData = (data) => {
    db.query('UPDATE annonce SET titre = ?, image = ?, description = ?, localisation = ? WHERE idAnnonce = ?', data, (err, res) => {
        if (err) {
            throw err;
        }
    });
}

