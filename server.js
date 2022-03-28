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
    profilePictureUploadHandler,
    registerHandler,
    updatePassword,
    updateUserData,
    updateUserDataParam
} from "./src/controllers/User.js";
import {
    findAllAnnonces,
    findAnnonce,
    findAnnonceByMotClef, findAnnonceByMotsClefs,
    registerAnnonce,
    updateAnnonce
} from "./src/controllers/Annonce.js";
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
    if (req.user.idUtilisateur !== req.params.idUtilisateur) {
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
app.get("/users/public/:idUtilisateur", authMW, findUtilisateurPublicInfo); // permet de récupérer les infos d'un utilisateur : [idUtilisateur]
app.put("/users/update", authMW, updateUserData); // permet de mettre à jour les infos d'un utilisateur : []
app.post("/users/update/", authMW, updateUserDataParam);
app.put("/users/updatePassWord", authMW, updatePassword); // permet de mettre à jour le mot de passe d'un utilisateur : [oldPassword, newPassword, newPassword2, idUtilisateur]
app.get("/users/photoProfile/:idUtilisateur", getProfilePictureById); // permet de récupérer la photo de profil d'un utilisateur : [idUtilisateur]
app.get("/users/cv/:idUtilisateur", authMW, getCVFileUtilisateur); // permet de récupérer le CV d'un utilisateur : [idUtilisateur]
app.post("/users/cvhandler", cvFileHandler); // permet de mettre à jour le CV d'un utilisateur : [idUtilisateur, cv (dans files de la requête post)]
app.post("/users/picturehandler", profilePictureUploadHandler); // permet de mettre à jour la photo de profil d'un utilisateur : [idUtilisateur, photo (dans files de la requête post)]
// Routes - Annonce
app.get("/annonce/:idUtilisateur", findAnnonce); // permet de récupérer les annonces d'un utilisateur : [idUtilisateur]
app.get("/annonces/all", authMW, findAllAnnonces); // permet de récupérer toutes les annonces
app.post("/annonce/create", authMW, registerAnnonce); // permet de créer une annonce : [titre, description, idEntreprise, localisation]
app.put("/annonce/update", authMW, updateAnnonce); // permet de mettre à jour une annonce : [titre, description, localisation, idAnnonce]
app.get("/annonce/motClef/:motClef", findAnnonceByMotClef);
app.get("/annonce/motsClefs/:motsClefs", findAnnonceByMotsClefs);
// Routes - Entreprise
app.get("/entreprise/:idUtilisateur", findEntreprise); // permet de récupérer les infos d'une entreprise : [idUtilisateur]
app.get("/entreprises/all", registerEntreprise); // permet de créer une entreprise : [nom, email, passspnseonse]
app.put("/entreprise/update", authMW, updateEntreprise); // permet de mettre à jour les données d'une entreprise : [nom, email, photoProfile, idEntreprise]
app.put("/entreprise/updatePassWord", authMW, updatePassword); // permet de mettre à jour le mot de passe d'une entreprise : [oldPassword, newPassword, newPassword2, idEntreprise]
// Routes - Candidature
app.get("/candidatures/annonce/:idAnnonce", authMW, getCandidatureAnnonce); // permet de récupérer les candidatures d'une annonce : [idAnnonce]
app.get("/candidatures/candidat/:idCandidat", authMW, getCandidatureCandidat); // permet de récupérer les candidatures d'un candidat : [idCandidat]
app.post("/candidature/create", authMW, registerCandidature); // permet de créer une candidature : [CVFile, LettreMotivation, idCandidat, idAnnonce]
// Routes - Conversation
app.get("/conversation/utilisateur/:idUtilisateur", authMW, checkUserId, findAllConversationByIDUser); // permet de récupérer toutes les conversations d'un utilisateur à partir de son id: [idUtilisateur]
app.get("/conversation/annonce/:idAnnonce", authMW, findAllConversationByIdAnnonce); // permet de récupérer toutes les conversations d'une annonce : [idAnnonce]
app.post("/conversation/create", authMW, addToConversationByUtilisateur); // permet de créer une conversation : [idUtilisateur, idUrilisateur2]
// Routes - Message
app.get("/message/conversation/:idConversation", authMW, findAllMessageByIDConversation); // permet de récupérer tous les messages d'une conversation à partir de son ID: [idConversation]
app.post("/message/conversation/send", authMW, addMessageToConversationByID); // permet d'envoyer un message à une conversation à partir de son ID : [message, idConversation, idUtilisateur]
// Routes - Experience
app.post("/experience/create", authMW, experienceHandler); // permet de créer une experience : [idUtilisateur, dateDebut, dateFin, societe, poste, type]
app.put("/experience/update", authMW, updateExperience); // permet de mettre à jour une experience : [dateDebut, dateFin, societe, poste, type, idExperience]
app.get("/experience/all/:idUtilisateur", authMW, getAllExperiencesUser); // permet de récupérer toutes les experiences d'un utilisateur : [idUtilisateur]
app.get("/experience/:idExperience", authMW, getExperienceByIdExperience); // permet de récupérer une experience : [idExperience]
app.delete("/experience/:idExperience", authMW, deleteExperienceByIdExperience); // permet de supprimer une experience : [idExperience]
// Routes - autres
// TODO : nombre de message non lus par conversation