import db from "../../config/connexionBDD.js";

/**
 * Méthode qui retourne tout les experiences d'un utilisateur
 * @param idUtilisateur : id de l'utilisateur
 * @param cb : callback
 */
export const findAllExperienceByIdUtilisateur = (idUtilisateur, cb) => {
    db.query(
    `SELECT * FROM experience WHERE idUtilisateur = ?`, [idUtilisateur], (err, rows) => {
          if (err) {
              console.log(err)
              cb(err, null);
              return;
          }
          if (rows.length) {
              cb(null, rows);
              return;
          }
          cb({erreur: "not_found"});
      }
  );
};

/**
 * Méthode qui retourne une experience par idExperience
 * @param idExperience : id de l'experience
 */
export const findExperienceByIdExperience = (idExperience, cb) => {
    db.query(
    `SELECT * FROM experience WHERE idExperience = ?`,
    [idExperience], (err, row) => {
          if (err) {
              console.log(err)
              cb(err, null);
              return;
          }
          if (row.length) {
              cb(null, row);
              return;
          }
          cb({erreur: "not_found"});
      }
  );
};

/**
 * Méthode qui permet de créer une experience par idUtilisateur
 * @param data : data de l'experience
 */
export const addExperienceByIdUtilisateur = (data) => {
    console.log(data)
    db.query('INSERT INTO experience (idUtilisateur, dateDebut, dateFin, societe, poste, type) VALUES (?, ?, ?, ?, ?, ? )', data, (err) => {
        if (err) {
             throw err;
        }
    });
}

/**
 * Méthode qui permet de modifier une experience par idExperience
 * @param data : data de l'expeerience
 */
export const updateExperienceByIdExperience = (data) => {
    console.log(data)
    db.query('UPDATE experience SET dateDebut = ? , dateFin = ?, societe = ?, poste = ? WHERE idExperience = ?', data, (err) => {
        if (err) {
             throw err;
        }
    });
}

/**
 * Méthode qui permet de supprimer une experience par idExperience
 * @param idExperience : id de l'experience
 */
export const deletExperienceByIdExperience = (idExperience) => {
    db.query('DELETE FROM experience WHERE idExperience = ?', [idExperience], (err) => {
        if (err) {
             throw err;
        }
    });
}