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
            //console.log('The solution is: ', JSON.stringify(rows[0]));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(rows[0]));
            conn.release();
        });
    });
}

exports.createUtilisateur = (req, res) => {
    const objPOST = req.body;
    var fields = "nom, prenom, email, motdepasse, type";
    var val = "?,?,?,?,?";
    var tabVal = [objPOST.nom, objPOST.prenom, objPOST.email, objPOST.mdp, objPOST.type];

    if (objPOST.photo != null) {
        fields += ", photoprofile";
        val += ", ?";
        tabVal.push(objPOST.photo);
    }
    if (objPOST.description != null) {
        fields += ", description";
        val += ", ?";
        tabVal.push(objPOST.description);
    }
    if (objPOST.cvfile != null) {
        fields += ", cvfile";
        val += ", ?";
        tabVal.push(objPOST.cvfile);
    }

    db.getConnection((err, conn) => {
        conn.query('INSERT INTO utilisateur('+ fields + ')VALUES('+ val + ');', tabVal, function (err, data) {
            if (err) throw err;
            res.end("Création validée avec validation !");
            console.log("Création validée avec validation !");
            conn.release();
        });
    });
}