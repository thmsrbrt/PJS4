import db from "../../config/connexionBDD.js";

/**
 * Méthode permettant de trouver toutes les annonces
 * @param cb {callback} traitement du résultat
 */
export const findAllAnnonce = (cb) => {
    db.query('SELECT A.idAnnonce, A.titre, A.image, A.Description, A.idEntreprise, COUNT(C.idCandidature) AS NbCandidat, A.lien FROM Annonce A LEFT JOIN Candidature C ON A.idAnnonce = C.idannonce GROUP BY A.idAnnonce', (err, rows) => {
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
    db.query('SELECT A.idAnnonce, A.titre, A.image, A.Description, A.idEntreprise, A.localisation, A.datePublication, COUNT(C.idCandidature) AS NbCandidat, A.lien FROM Annonce A LEFT JOIN Candidature C ON A.idAnnonce = C.idannonce WHERE A.idAnnonce = ? GROUP BY A.idAnnonce', [id], (err, row) => {
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


export const findAnnonceByUserIdModel = (idUser, cb) => {
    db.query('SELECT * FROM Annonce A WHERE A.idEntreprise = ?', [idUser], (err, row) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }
        if (row) {
            cb(null, row);
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
    db.query('INSERT INTO annonce (titre, image, description, idEntreprise, datePublication, localisation, lien) VALUES (?,?,?,?, NOW(), ?, ?)', data, (err, res) => {
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

/**
 * Méthode permettant de trouver des annonces par mot clef
 * @param data {string} contenant le mot clé
 * @param cb {callback} traitement du résultat
 */
export const searchByKeywords = (data, cb) => {
    db.query(`SELECT *
              FROM Annonce A
              WHERE (Titre LIKE ? OR Description LIKE ? OR localisation LIKE ? OR
                     datePublication LIKE ?);`, [data, data, data, data], (err, row) => {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, row);
    });
}

/**
 * Méthode qui permet de supprimer une annonce par idAnnonce
 * @param idAnnonce : id de l'annonce
 */
export const deleteAnnonceByIdAnnonce = (idAnnonce) => {
    db.query('DELETE FROM annonce WHERE idAnnonce = ?', [idAnnonce], (err) => {
        if (err) {
            throw err;
        }
    });
}

export const addFavoriteAnnonceModel = (data, cb) => {
    db.query('INSERT INTO userFav (idUser, idAnnonce) VALUES (?,?)', data, (err, res) => {
        console.log(err);
        if (err) {
            cb(err, null);
        }
        cb(null, true);
    });
}

export const findCandidatFavoriteAnnonceModel = (idUser, cb) => {
    db.query("SELECT * FROM userFav, annonce WHERE userFav.idUser = ? AND userFav.idAnnonce = annonce.idAnnonce", [idUser], (err, rows) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }
        cb(null, rows);
    });
}

export const deleteFavAnnonceModel = (data, cb) => {
    db.query("DELETE FROM userFav WHERE idUser = ? AND idAnnonce = ?", data, (err, rows) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }

        cb(null, true);
    });
}