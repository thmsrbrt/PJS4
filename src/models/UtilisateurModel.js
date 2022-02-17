var db = require('../../config/connexionBDD');

// récupère tous les utilsateurs
exports.findAllUtilisateurs = res => {
    db.getConnection((err, conn) =>{
        conn.query('SELECT * FROM utilisateur;', function(err, rows, fields) {
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
        conn.query('SELECT * FROM utilisateur WHERE idUtilisateur = ' + id +';', function(err, rows, fields) {
            if (err) throw err;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(rows[0]));
            conn.release();
        });
    });
}
/*
exports.findOneUtilisateurByEmail = (email, res) => {
    db.getConnection((err, conn) => {
        conn.query("SELECT * FROM utilisateur WHERE Email = '" + email +"';", function(err, rows, fields) {
            if (err) throw err;
            let nb = rows.length;
            if (nb === 0) {
                console.log("Aucun compte avec cet email, il faut créer");
            }
            else {
                console.log("Deja un compte dans la BDD");
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(nb));
            conn.release();
        });
    });
}

 */

exports.findOneUtilisateurByEmail = (email, last_name, first_name, done, accessToken) => {
    db.getConnection((err, conn) => {
        conn.query("SELECT * FROM utilisateur WHERE Email = '" + email +"';", function(err, rows, fields) {
            if (err) throw err;
            let nb = rows.length;
            if (nb === 0) {
                console.log("Aucun compte avec cet email, il faut créer");
                let fields = "nom, prenom, email, motdepasse"; // nom dans les colonnes de la table utilisateurs
                let val = "?,?,?,?";
                let tabVal =[last_name, first_name, email, accessToken];

                let id = createUtilisateurBis(fields, val, tabVal);
                console.log("j'ai crée le compte !");
                done(null, {id: id, email: email});
            }
            else {
                console.log("Deja un compte dans la BDD");
                done(null, {id: rows[0].idUtilisateur, email: rows[0].email});
                console.log("existant !");

            }
            conn.release();
        });
    });
}

exports.findOneUtilisateurByEmailPSD = (profile, done, accessToken) => {
    db.getConnection((err, conn) => {
        conn.query("SELECT * FROM utilisateur WHERE Email = '" + profile._json.email +"' and MotDePasse = '" + profile._json.password + "';", function(err, rows, fields) {
            if (err) throw err;
            let nb = rows.length;
            if (nb === 0) {
                console.log("Aucun compte avec cet email, il faut créer");
                let fields = [nom, prenom, email, motdepasse];
                let val = "?,?,?,?";
                let tabVal =[profile.displayName, "NULL", profile._json.email, accessToken];
            }
            else {
                console.log("connexion réussi");
                done(null, {id: rows[0].idUtilisateur, email: rows[0].email});
            }
            conn.release();
        });
    });
}

exports.createUtilisateur = (fields, val, tabVal, res) => {
    db.getConnection((err, conn) => {
        conn.query('INSERT INTO utilisateur('+ fields + ')VALUES('+ val + ');', tabVal, function (err, data) {
            if (err) throw err;
            res.status(200).end("Création validée avec validation !");
            console.log("Création validée avec validation !");
            conn.release();
        });
    });
}

function createUtilisateurBis(fields, val, tabVal)  {
    let test;
    db.getConnection((err, conn) => {
        conn.query('INSERT INTO utilisateur('+ fields + ')VALUES('+ val + ');', tabVal, function (err, data) {
            if (err) throw err;
            console.log("Création validée avec validation !");
            console.log(data.insertId);
            conn.release();
            test =  data.insertId
        });
    });
    return test;
}

exports.updateUtilisateur = (updateString, id, res) => {
    db.getConnection((err, conn) => {
        conn.query('UPDATE utilisateur SET '+ updateString + ' WHERE idUtilisateur =' + id + ';', function (err, data) {
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
        conn.query('DELETE FROM utilisateur WHERE idUtilisateur = '+ id + ';', (err, result) => {
            if (err) throw err;
            res.status(200).end("Suppression");
            console.log("Suppression réussie");
            conn.release();
        })
    })
}

export const updateUserToken = (email, token, timestamp) => {
    db.getConnection((err, conn) => {
        conn.query('UPDATE utilisateur SET token = ?, tokenTimeStamp = ? WHERE Email = ?;', [token, timestamp, email], function (err, data) {
            if (err) throw err;
        });
    });
}

export const createUser = (donnees) =>  {
    try {

        db.getConnection((err, conn) => {
        try {
            conn.query('INSERT INTO utilisateur (Nom, Prenom, Email, MotDePasse, PhotoProfile, Type) VALUES (?,?,?,?,"default","user");', donnees, function (err, data) {
                if (err) throw err;
            });
        }catch (err){
            throw err;
        }
    });
    }catch (err){
        throw err;
    }
}