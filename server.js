// le root du projet
const express = require('express')
const cors = require('cors');
const crypto = require('crypto');
const bodyparser = require('body-parser');
const {updateUserToken, createUser} = require("./src/models/UtilisateurModel");


const app = express()
require('dotenv').config(); // pour récupérer les données dans .env

require("./src/routes/ConnexionRoutes")(app);
require("./src/routes/UtilisateurRoutes")(app);

// TODO : A specifier pour pas rendre l'api publique
app.use(cors({
    origin: '*'
}));

// Si besoin d'explications, demandez moi
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

// Ecoute sur le PORT 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port : ${PORT}`);
})