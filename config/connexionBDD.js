//const mariadb = require('mariadb');
const mysql = require("mysql");

//connexion BDD : à changer avec vos info (userDB, passwordDB, database)
const userDB = 'lngeth';
const passwordDB = '0207';
const database = 'pjs4';

//const connection = mariadb.createPool({ //mariaDB
const conn = mysql.createPool({ // mysql
    host: 'localhost',
    port: '3306',
    user: userDB,
    password: passwordDB,
    database: database,
    connectionLimit: 5
});

module.exports = conn;