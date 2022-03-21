//const mariadb = require('mariadb');
import mysql from "mysql";
import 'dotenv/config';
//connexion BDD : à changer avec vos info (userDB, passwordDB, database)
const userDB = process.env.USERDB;
const passwordDB = process.env.PASSDB;
const database = process.env.DATABASE;

//const connection = mariadb.createPool({ //mariaDB
const conn = mysql.createPool({ // mysql
    host: 'localhost',
    port: '3306',
    user: userDB,
    password: passwordDB,
    database: database,
    connectionLimit: 5
});

export default conn;