const db = require('../../config/connexionBDD');

// récupère tous les utilsateurs
exports.findAllUtilisateurs = res => {
    db.query('SELECT * FROM utilisateur;', function (err, rows, fields) {
        if (err) throw err;
        //console.log('The solution is: ', JSON.stringify(rows[0]));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(rows), null, 2);
    });
}

/**
 * Méthode permettant de trouver un utilisateur en fonction de son id
 * @param id {Integer} id de l'user
 * @param cb {callback} traitement du résultat
 */
exports.findOneUtilisateurByID = (id, cb) => {
    db.query('SELECT idUtilisateur FROM utilisateur WHERE idUtilisateur = ?', [id], (err, rows) => {
        if (err) {
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

exports.findOneUtilisateurByEmail = (email, last_name, first_name, done, accessToken) => {
    db.query("SELECT * FROM utilisateur WHERE Email = ?;", [email], function (err, rows, fields) {
        if (err) throw err;
        let nb = rows.length;
        if (nb === 0) {
            console.log("Aucun compte avec cet email, il faut créer");
            let fields = "nom, prenom, email, motdepasse"; // nom dans les colonnes de la table utilisateurs
            let tabVal = [last_name, first_name, email, accessToken];

            let id = createUtilisateurBis(fields, tabVal);
            console.log("j'ai crée le compte !");
            done(null, {id: id, email: email});
        } else {
            console.log("Deja un compte dans la BDD");
            done(null, {id: rows[0].idUtilisateur, email: rows[0].email});
            console.log("existant !");// TODO: Recupérer l'id et le mettre dans la session (et regler le problème du /#_=_) pour la suppression
        }
    });
}

/**
 * Méthode permettant de trouver un utilisateur en fonction de son password et mot de passe
 * @param profil {array<string>} email + password
 * @param cb {callback} traitement du résultat
 */
exports.findOneUtilisateurByEmailPSD = (profil, cb) => {
    db.query("SELECT Email FROM utilisateur WHERE Email = ? and MotDePasse = ?;", profil, (err, rows) => {
        if (err) cb(err, null);

        if (rows.length) {
            cb(null, rows[0]);
            return;
        }
        cb({erreur : "not_found"});
    });
}

exports.createUtilisateur = (tabVal, res) => {
    conn.query('INSERT INTO utilisateur(nom, prenom, email, motdepasse, type, photoprofile, description, cvfile)VALUES(?,?,?,?,?,?,?,?);', tabVal, function (err, data) {
        if (err) throw err;
        res.status(200).end("Création validée avec validation !");
        console.log("Création validée avec validation !");
        conn.release();
    });
}

function createUtilisateurBis(fields, tabVal) {
    let test;
    db.query('INSERT INTO utilisateur(?)VALUES(?);', [fields, tabVal], function (err, data) {
        if (err) throw err;
        console.log("Création validée avec validation !");
        console.log(data.insertId);
        test = data.insertId
    });
    return test;
}

exports.updateUtilisateur = (updateString, id, res) => {
    db.query('UPDATE utilisateur SET ? WHERE idUtilisateur = ? ;', [updateString, id], function (err, data) {
        if (err) throw err;
        res.status(200).end("Update validée avec validation !");
        console.log("Update validée avec validation !");
    });
}

exports.erreurGit = () => {
    console.log("Je ne peux pas créer de compte car l'adresse mail n'est pas renseignée (privée)");
}

exports.deleteUtilisateurById = (id, res) => {
    db.query('DELETE FROM utilisateur WHERE idUtilisateur = ? ;', [id], (err, result) => {
        if (err) throw err;
        res.status(200).end("Suppression");
        console.log("Suppression réussie");
    })
}

exports.updateUserToken = (email, token, timestamp) => {
    db.query('UPDATE utilisateur SET token = ?, tokenTimeStamp = ? WHERE Email = ?;', [token, timestamp, email], function (err, data) {
        if (err) throw err;
    });
}

// TODO : Doc
exports.createUser = (donnees) => {
    db.query('INSERT INTO utilisateur (Nom, Prenom, Email, MotDePasse, PhotoProfile, Type) VALUES (?,?,?,?,"default","user");', donnees, function (err, data) {
        if (err) throw err;
    });
}