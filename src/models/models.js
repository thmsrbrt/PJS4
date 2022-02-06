var db = require('../../config/connexionBDD');

// récupère tous les utilsateurs
exports.findAllUtilisateurs = res => {
    db.getConnection((err, conn) =>{
        conn.query('SELECT * FROM utilisateur', function(err, rows, fields) {
            if (err) throw err;
            console.log('The solution is: ', rows[0]);
            res.send(rows[0])
            conn.release();
        });
    })

};
