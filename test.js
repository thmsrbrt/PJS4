const mariadb = require('mariadb');
const connection = mariadb.createPool({
    host: 'localhost',
    port: '3306',
    user:'trobert7',
    password: '0503',
    database: 'BDD_trobert7',
    connectionLimit: 5
});
async function asyncFunction() {
    let conn;
try {
    conn = connection.getConnection();
    const rows = await conn.query("SELECT * FROM Utilisateur");
    console.log(rows);
    conn.end();
} catch (err) {
    console.log("non");
    throw err;
}
    conn.end();
}

asyncFunction();

