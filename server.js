// le root du projet
import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import fileUpload from "express-fileupload";

import {
    cvFileHandler,
    findUtilisateur,
    findUtilisateurPublicInfo,
    getCVFileUtilisateur,
    getProfilePictureById,
    loginHandler,
    registerHandler,
    updatePassword,
    updateUserData,
    updateUserDataParam,
    profilePictureUploadHandler
} from "./src/controllers/User.js";
import {findAllAnnonces, findAnnonce, registerAnnonce, updateAnnonce} from "./src/controllers/Annonce.js";
import {findEntreprise, registerEntreprise, updateEntreprise} from "./src/controllers/Entreprise.js";
import {getCandidatureAnnonce, getCandidatureCandidat, registerCandidature} from "./src/controllers/Candidature.js";
import {
    addToConversationByUtilisateur,
    findAllConversationByIdAnnonce,
    findAllConversationByIDUser
} from "./src/controllers/Conversation.js";
import {addMessageToConversationByID, findAllMessageByIDConversation} from "./src/controllers/Message.js";
import {
    deleteExperienceByIdExperience,
    experienceHandler,
    getAllExperiencesUser,
    getExperienceByIdExperience,
    updateExperience
} from "./src/controllers/Experience.js";

const app = express()
export const accessTokenSecret = process.env.TOKENSECRET;

// TODO : A specifier pour pas rendre l'api publique
app.use(cors({
    origin: '*'
}));

// Si besoin d'explications, demandez moi
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(fileUpload({
    createParentPath: true
}));

// Ecoute sur le PORT 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port : ${PORT}`);
})

// TODO : un refresh des tokens

/**
 * Middleware permettant de vérifier l'auth d'une requête
 * @param req La requête
 * @param res La response
 * @param next La suite (le controller)
 */
const authMW = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            //console.log(user);
            if (err)
                return res.sendStatus(403);

            req.user = user;
            next();
        });
    } else
        res.sendStatus(401);
};


/**
 * Middleware permettant de vérifier l'auth d'une requête
 * @param req La requête
 * @param res La response
 * @param next La suite (le controller)
 * @returns {*} La response
 */
const checkUserId = (req, res, next) => {
    console.log(`params id utilisateur : ${req.params.idUtilisateur}`);
    console.log(`user id utilisateur : ${req.user.idUtilisateur}`);
    console.log("ici");
    if (req.user.idUtilisateur != req.params.idUtilisateur){
        //console.log("erreur")
        return res.sendStatus(403);
    }

    next();
};

// TODO : Normaliser le get de l'id utilisateur à req.params.idUtilisateur
// Routes - Utilisateurs
app.post("/login", loginHandler); // permet de login l'utilisateur : [email, password]
app.post("/register", registerHandler); // permet de créer un utilisateur : [email, password, nom, prenom, description]
app.get("/users/:idUtilisateur", authMW, checkUserId, findUtilisateur); // permet de récupérer les infos d'un utilisateur : [idUtilisateur]
app.get("/users/public/:idUtilisateur", authMW, findUtilisateurPublicInfo);
app.put("/users/update", authMW, updateUserData);
app.post("/users/update/", authMW, updateUserDataParam);
app.put("/users/updatePassWord", authMW, updatePassword);
app.get("/users/photoProfile/:idUtilisateur", getProfilePictureById);
app.get("/users/cv/:idUtilisateur", authMW, getCVFileUtilisateur);
app.post("/users/cvhandler", cvFileHandler);
app.post("/users/picturehandler", profilePictureUploadHandler);
// Routes - Annonce
app.get("/annonce/:idUtilisateur", findAnnonce);
app.get("/annonces/all", authMW, findAllAnnonces);
app.post("/annonce/create", authMW, registerAnnonce);
app.put("/annonce/update", authMW, updateAnnonce);
// Routes - Entreprise
app.get("/entreprise/:idUtilisateur", findEntreprise);
app.get("/entreprises/all", registerEntreprise);
app.put("/entreprise/update", authMW, updateEntreprise);
app.put("/entreprise/updatePassWord", authMW, updatePassword);
// Routes - Candidature
app.get("/candidatures/annonce/:idAnnonce", authMW, getCandidatureAnnonce);
app.get("/candidatures/candidat/:idCandidat", authMW, getCandidatureCandidat);
app.post("/candidature/create", authMW, registerCandidature);
// Routes - Conversation
app.get("/conversation/utilisateur/:idUtilisateur", authMW, checkUserId, findAllConversationByIDUser);
app.get("/conversation/annonce/:idAnnonce", authMW, findAllConversationByIdAnnonce);
app.post("/conversation/create", authMW, addToConversationByUtilisateur);
// Routes - Message
app.get("/message/conversation/:idConversation", authMW, findAllMessageByIDConversation);
app.post("/message/conversation/send", authMW, addMessageToConversationByID);
// Routes - Experience
app.post("/experience/create", authMW, experienceHandler);
app.put("/experience/update", authMW, updateExperience);
app.get("/experience/all/:idUtilisateur", authMW, getAllExperiencesUser);
app.get("/experience/:idExperience", authMW, getExperienceByIdExperience);
app.delete("/experience/:idExperience", authMW, deleteExperienceByIdExperience);
// Routes - autres
// TODO : nombre de message non lus par conversation