// le root du projet
var express = require('express')
var app = express()
// const cors = require("cors"); // pour envoyer du JSON plus facilement

require("./src/routes/routes")(app);

// Ecoute sur le PORT 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port : ${PORT}`);
})