// le root du projet
var express = require('express')
var app = express()
// const cors = require("cors"); // pour envoyer du JSON plus facilement
require('dotenv').config(); // pour récupérer les données dans .env

console.log(process.env.GITHUB_CLIENT_ID);
console.log(process.env.GITHUB_CLIENT_SECRET);

require("./src/routes/ConnexionRoutes")(app);
require("./src/routes/UtilisateurRoutes")(app);

// Ecoute sur le PORT 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port : ${PORT}`);
})