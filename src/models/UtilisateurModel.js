var db = require('../../config/connexionBDD');

// récupère tous les utilsateurs
exports.findAllUtilisateurs = res => {
    db.getConnection((err, conn) => {
        conn.query('SELECT * FROM utilisateur;', function (err, rows, fields) {
            if (err) throw err;
            //console.log('The solution is: ', JSON.stringify(rows[0]));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(rows), null, 2);
            conn.release();
        });
    });
}

exports.findOneUtilisateurByID = (id, res) => {
    db.getConnection((err, conn) => {
        conn.query('SELECT * FROM utilisateur WHERE idUtilisateur = ' + id + ';', function (err, rows, fields) {
            if (err) throw err;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(rows[0]));
            conn.release();
        });
    });
}

exports.findOneUtilisateurByEmail = (email, last_name, first_name, done, accessToken) => {
    db.getConnection((err, conn) => {
        conn.query("SELECT * FROM utilisateur WHERE Email = ?;", [email], function (err, rows, fields) {
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
            conn.release();
        });
    });
}

exports.findOneUtilisateurByEmailPSD = (profil, res) => {
    db.getConnection((err, conn) => {
        conn.query("SELECT * FROM utilisateur WHERE Email = ? and MotDePasse = ?;", profil, function (err, rows, fields) {
            if (err) throw err;
            let nb = rows.length;
            if (nb === 0) {
                console.log("Aucun compte avec cet email, il faut créer");
                //let fields = [nom, prenom, email, motdepasse];
                //let tabVal = [profil.displayName, "NULL", profil._json.email, accessToken];
                res.end('nok');

            } else {
                console.log("connexion réussi");
                done(null, {id: rows[0].idUtilisateur, email: rows[0].email});
            }
            res.end('ok');
            conn.release();
        });
    });

}

exports.createUtilisateur = (tabVal, res) => {
    db.getConnection((err, conn) => {
        conn.query('INSERT INTO utilisateur(nom, prenom, email, motdepasse, type, photoprofile, description, cvfile)VALUES(?,?,?,?,?,?,?,?);', tabVal, function (err, data) {
            if (err) throw err;
            res.status(200).end("Création validée avec validation !");
            console.log("Création validée avec validation !");
            conn.release();
        });
    });
}

function createUtilisateurBis(fields, tabVal) {
    let test;
    db.getConnection((err, conn) => {

        conn.query('INSERT INTO utilisateur(?)VALUES(?);', [fields, tabVal], function (err, data) {
            if (err) throw err;
            console.log("Création validée avec validation !");
            console.log(data.insertId);
            conn.release();
            test = data.insertId
        });
    });
    return test;
}

exports.updateUtilisateur = (updateString, id, res) => {
    db.getConnection((err, conn) => {
        conn.query('UPDATE utilisateur SET ? WHERE idUtilisateur = ? ;', [updateString, id], function (err, data) {
            if (err) throw err;
            res.status(200).end("Update validée avec validation !");
            console.log("Update validée avec validation !");
            conn.release();
        });
    });
}

exports.erreurGit = () => {
    console.log("Je ne peux pas créer de compte car l'adresse mail n'est pas renseignée (privée)");
}

exports.deleteUtilisateurById = (id, res) => {
    db.getConnection((err, conn) => {
        conn.query('DELETE FROM utilisateur WHERE idUtilisateur = ? ;', [id], (err, result) => {
            if (err) throw err;
            res.status(200).end("Suppression");
            console.log("Suppression réussie");
            conn.release();
        })
    })
}

exports.updateUserToken = (email, token, timestamp) => {
    db.getConnection((err, conn) => {
        conn.query('UPDATE utilisateur SET token = ?, tokenTimeStamp = ? WHERE Email = ?;', [token, timestamp, email], function (err, data) {
            if (err) throw err;
        });
    });
}

exports.createUser = (donnees) => {
    try {
        db.getConnection((err, conn) => {
            try {
                conn.query('INSERT INTO utilisateur (Nom, Prenom, Email, MotDePasse, PhotoProfile, Type) VALUES (?,?,?,?,"default","user");', donnees, function (err, data) {
                    if (err) throw err;
                });
            } catch (err) {
                throw err;
            }
        });
    } catch (err) {
        throw err;
    }
}