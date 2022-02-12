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
            res.end(JSON.stringify(utilisateur));
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
