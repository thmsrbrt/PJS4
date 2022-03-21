// le root du projet
import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
import 'dotenv/config';


import {findUtilisateur, loginHandler, registerHandler} from "./src/controllers/User.js";

const app = express()


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

// Routes
app.post("/login", loginHandler)
app.post("/register", registerHandler)
// TODO : Vérifier que client ait le droit de faire cette requête
app.get("/users/:id", findUtilisateur)

