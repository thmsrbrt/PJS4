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
    })
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
    })
}
