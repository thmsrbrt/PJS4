// le root du projet
const express = require('express')
const cors = require('cors');
const crypto = require('crypto');
const bodyparser = require('body-parser');

const app = express()
require('dotenv').config(); // pour récupérer les données dans .env

console.log(process.env.GITHUB_CLIENT_ID);
console.log(process.env.GITHUB_CLIENT_SECRET);

require("./src/routes/ConnexionRoutes")(app);
require("./src/routes/UtilisateurRoutes")(app);

// TODO : A specifier pour pas rendre l'api publique
app.use(cors({
    origin: '*'
}));

// Si besoin d'explications, demandez moi
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

/**
 * Méthode permettant de vérifier la requête POST de login
 * @response avec un body si connexion possible, sans sinon
 */
// TODO : vérfier en BDD + enregistrer le token en bdd avec timestamp
app.post("/login", (request, response) =>{
    //console.log(request.body)
    const { email, password } = request.body;
    //console.log(getHashedPassword(password))

    if (users.find(user => user.email === email && user.password === getHashedPassword(password))){
        const authToken = getToken(email);
        response.json({"auth" : authToken}).send()
        // Avant, mettre le authToken en bdd pour le user concerné
    }
    else
        response.send();
})

// Ecoute sur le PORT 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port : ${PORT}`);
})

/**
 * Fonction permettant de créer un token d'authentification
 * @param email {string} Email de l'utilisateur
 * @returns {string} Le token hashé et en base 64 composé d'une random string + email + timestamp
 */
const getToken = (email) => {
    return getHashedPassword(crypto.randomBytes(48).toString() + email + Date.now());
}

/**
 * Fonction permettant de transformer une string en un hash sha256 en base 64
 * @param password {string} La string à transformer
 * @returns {string} La string hashée et en base 64
 */
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    return sha256.update(password).digest('base64');
}

/**
 * A défaut d'utiliser la bdd, une liste d'objets avec comme attributs une email et un mot de passe hashé
 * @type {[{email: string, password: string}]}
 */
const users = [
    {
        email: 'ghjksd@ghn.fr',
        password: 'p8IJZfm72+lkhaLi3cFO1BPyCQxxwaPq26TqJJrkLWg=', //gfdsJHGF54!()
    },
]