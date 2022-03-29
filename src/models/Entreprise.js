import db from "../../config/connexionBDD.js";

/**
 * Méthode permettant de récupérer une entreprise par son id dans la BDD
 * @param id {number} - id de l'entreprise
 * @param cb {callback} traitement du résultat
 */
export const findEntrepriseByID = (id, cb) => {
    db.query("SELECT * FROM V_Entreprise WHERE idUtilisateur = ?", [id], (err, row) => {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        }
        if (row) {
            cb(null, row);
            return;
        }
        cb({erreur: "Aucune entreprise trouvée"});
    });
}

/**
 * Méthode qui permet d'enregistrer une nouvelle entreprise dans la BDD
 * @param data {object} - données de l'entreprise
 */
export const createEntreprise = (data) => {
    db.query('INSERT INTO Utilisateur (Nom, Email, MotDePasse, PhotoProfile, Type) VALUES (?, ?, ?, "default.png", "Entreprise")', data, (err, row) => {
        if (err) {
            throw err;
        }
    })
}

/**
 * Méthode qui permet de modifier une entreprise dans la BDD
 * @param data {object} - données de l'entreprise
 */
export const updateEntrepriseData = (data) => {
    db.query('UPDATE Utilisateur SET Nom = ?, Email = ?, PhotoProfile = ? WHERE idUtilisateur = ?', data, (err, row) => {
        if (err) {
            throw err;
        }
    })
}