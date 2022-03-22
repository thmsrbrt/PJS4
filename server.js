// le root du projet
import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
import 'dotenv/config';


import {findUtilisateur, loginHandler, registerHandler} from "./src/controllers/User.js";
import {findAnnonce, findAllAnnonces, registerAnnonce} from "./src/controllers/Annonce.js";
import { findEntreprise, registerEntreprise} from "./src/controllers/Entreprise.js";
import {getCandidatureAnnonce, getCandidatureCandidat, registerCandidature} from "./src/controllers/Candidature.js";
import {
    addToConversationByUtilisateur,
    findAllConversationByIdAnnonce,
    findAllConversationByIDUser
} from "./src/controllers/Conversation.js";
import {findAllMessageByIDConversation} from "./src/controllers/Message.js";

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

// Routes - Utilisateurs
app.post("/login", loginHandler);
app.post("/register", registerHandler);
// TODO : Vérifier que client ait le droit de faire cette requête
// TODO : faire les updates
app.get("/users/:idUtilisateur", findUtilisateur);
// Routes - Annonce
app.get("/annonce/:idUtilisateur", findAnnonce);
app.get("/annonces/all", findAllAnnonces);
app.post("/annonce/create", registerAnnonce);
// Routes - Entreprise
app.get("/entreprise/:idUtilisateur", findEntreprise);
app.get("/entreprises/all", registerEntreprise);
// Routes - Candidature
app.get("/candidatures/annonce/:idAnnonce", getCandidatureAnnonce);
app.get("/candidatures/candidat/:idCandidat", getCandidatureCandidat);
app.post("/candidature/create", registerCandidature);
// Routes - Conversation
app.get("/conversation/utilisateur/:idUtilisateur", findAllConversationByIDUser);
app.get("/conversation/annonce/:idAnnonce", findAllConversationByIdAnnonce);
app.post("/conversation/create", addToConversationByUtilisateur);
// Routes - Message
app.get("/message/conversation/:idConversation", findAllMessageByIDConversation);

