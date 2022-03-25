import {
    createUser,
    findOneUtilisateurByEmail,
    findOneUtilisateurByEmailPSD,
    findOneUtilisateurByID,
    findPassWordByIdUtilisateur,
    getCVFileUtilisateurBD,
    getProfilePictureByIdBD,
    updateCVFileUtilisateur,
    updatePasswordBDD,
    updateUserDataParamBD,
    updateUtilisateur,
} from "../models/User.js";
import crypto, {randomFillSync} from "crypto";
import jwt from "jsonwebtoken";
import {accessTokenSecret} from "../../server.js";
import fs from 'fs';
import busboy from 'connect-busboy';
import * as path from "path";


// TODO : hasher les mots de passes
/**
 * Méthode permettant de vérifier la requête POST de login
 * @response avec un body si connexion possible, sans sinon
 */
export const loginHandler = (req, res) => {
    const {email, password} = req.body;
    if (!email || !password)
        return res.sendStatus(401)

    //if (users.find(user => user.email === email && user.password === getHashedPassword(password))) { // remplacer par une req bdd
    findOneUtilisateurByEmailPSD([email, getHashedPassword(password)], (err, data) => {
        if (err) {
            err.erreur === "not_found" ? res.status(404).send({message: 'Utilisateur non trouvé'}) : res.status(403).send({message: "Erreur"});
        } else {
            // const authToken = getToken(email, date);
            // updateUserToken(email, authToken, date);
            //console.log(data.idUtilisateur)
            const accessToken = jwt.sign({email: data.email, idUtilisateur: data.idUtilisateur}, accessTokenSecret);
            res.json({accessToken, idUtilisateur: data.idUtilisateur}).send()
        }
    })
}

/**
 * Méthode permettant de trouver un utilisateur à partir d'un id
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si user non trouvé et 200 si trouvé
 */
export const findUtilisateur = (req, res) => {
    const idUtilisateur = req.params.idUtilisateur;
    if (idUtilisateur == null)
        res.status(500).send({message: "Erreur, idUser null"});
    else
        findOneUtilisateurByID(idUtilisateur, (err, data) => {
            if (err)
                err.erreur === "not_found" ? res.status(404).send({message: 'Utilisateur non trouvé'}) : res.status(500).send({message: "Erreur"});
            else
                res.status(200).send(data);
        });
}

/**
 * Méthode permettant de trouver les infos publiques d'un utilisateur à partir d'un id
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si user non trouvé et 200 si trouvé
 */
export const findUtilisateurPublicInfo = (req, res) => {
    const idUtilisateur = req.params.idUtilisateur;
    if (idUtilisateur == null)
        res.status(500).send({message: "Erreur, idUser null"});
    else
        findOneUtilisateurByID(idUtilisateur, (err, data) => {
            if (err)
                err.erreur === "not_found" ? res.status(404).send({message: 'Utilisateur non trouvé'}) : res.status(500).send({message: "Erreur"});
            else
                res.status(200).send({idUtilisateur:data.idUtilisateur, Prenom:data.Prenom, PhotoProfile: data.PhotoProfile});
        });
}



/**
 * Méthode permettant de trouver la photo de profil de l'utilisateur à partir de son id
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si user non trouvé et 200 si trouvé
 */
export const getProfilePictureById = (req, res) => {
    const idUtilisateur = req.params.idUtilisateur;
    if (idUtilisateur == null)
        res.status(500).send({message: "Erreur, idUtilisateur null"});
    else
        getProfilePictureByIdBD(idUtilisateur, (err, data) => {
            if (err)
                err.erreur === "not_found" ? res.status(404).send({message: 'Utilisateur ou image non trouvée'}) : res.status(500).send({message: "Erreur"});
            else {
                res.sendFile(data.PhotoProfile, {root: '.'})
            }
        })
}


/**
 * Méthode permettant de vérifier la requête POST de register
 * @response Code HTTP 201 si réussite, 403 dans le cas contraire, avec la raison dans le body ("faillure")
 */
export const registerHandler = (req, res) => {
    const {email, password, nom, prenom} = req.body;
    let description = req.body.description;
    if (!email || !password || !nom || !prenom)
        return res.sendStatus(401)
    if (description == null)
        description = "null";
    findOneUtilisateurByEmail(email, (err, data) => {
        if (err) {
            if (err.erreur === "not_found") {
                try {
                    createUser([nom, prenom, email, getHashedPassword(password), description]);
                    res.sendStatus(200);
                } catch (err) {
                    res.status(403).json({"faillure": err}).send();
                }
            } else {
                res.status(500).send({message: "Erreur"});
            }
        } else {
            res.status(404).send({message: 'Utilisateur déjà existant'})
        }
    });
}


/**
 * Méthode permettant d'enregistrer un CV dans la BDD
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 */
export const cvFileHandler = (req, res) => {
    const idUtilisateur = req.body.idutilisateur;
    console.log(idUtilisateur)
    //var file = req.files.cvfile;
    const random = (() => {
        const buf = Buffer.alloc(16);
        return () => randomFillSync(buf).toString('hex');
    })();
    if (!idUtilisateur)
        res.status(500).send({message: "Erreur, idUser or CV null"});
    else {
        try {
            // recupere le fichier avec busboy et l'enregistre dans le dossier uploads
            req.pipe(req.busboy);
            // console.log(req.busboy);
            const bb = busboy({headers: req.headers}); //https://www.npmjs.com/package/busboy
            console.log(bb);
            console.log(req.files);

            req.busboy.on('file', (fieldname, file, filename, name) => { // https://stackoverflow.com/questions/31186192/req-busboy-onfile-not-firing
                console.log("file")
                const eename = random() + name;
                const filePath = path.join('./public/CVfiles/', eename);
                file.pipe(fs.createWriteStream(filePath));
                file.on('end', () => {
                    // enregistre le fichier dans la BDD
                    updateCVFileUtilisateur([idUtilisateur, eename]);
                });
                res.status(200).send({message: "CV enregistré"});
            });
            /**
             // recupere le fichier et l'enregistre dans le dossier uploads
             const file = busboy({ headers: req.headers });
             console.log(file);
             const fileName = random() + file.name;
             file.mv(`./public/CVfiles/${fileName}`, (err) => {
                if (err)
                    res.status(500).send({message: "Erreur, ieeeempossible d'enregistrer le CV"});
                else {
                    // enregistre le nom du fichier dans la BDD
                    try {
                        updateCVFileUtilisateur([idUtilisateur, fileName]);
                        res.status(200).send({message: "CV enregistré"});
                    } catch (err) {
                        res.status(500).send({message: "Erreur, impossible d'enregistrer le CV"});
                    }
                }
            });

             console.log("try")
             const bb = busboy({ headers: req.headers });
             bb.on('file', (name, file, info) => {
                console.log("eeeeeeee")
                const saveTo = path.join(os.tmpdir(), './' + `busboy-upload-${random()}`);
                file.pipe(fs.createWriteStream(saveTo));
            });
             bb.on('close', () => {
                res.writeHead(200, { 'Connection': 'close' });
                res.end(`That's all folks!`);
            });
             req.pipe(bb);
             //return;
             console.log(")----------------------------------------")

             var fstream;
             req.pipe(req.busboy);
             console.log("test")
             //console.log(req.busboy)
             //const fileName = crypto.randomBytes(20).toString('hex')
             console.log(fileName)
             req.busboy.on('file', function (fieldname, file, fileName)  {
                console.log("Uploading: " + fileName);
                updateCVFileUtilisateur([fileName, idUtilisateur]);

                fstream = fs.createWriteStream('./public/CVfiles/' + fileName);
                file.pipe(fstream);
                fstream.on('close', function () {
                    res.send({message: 'back'} );

                });
            });
             res.sendStatus(201);
             */
        } catch (err) {
            res.status(500).send({message: "Erreur catch  enregistrement CV"});
        }
    }
}

/**
 * Méthode permettant de récupérer un CV d'un utilisateur
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si user non trouvé et 200 si trouvé
 */
export const getCVFileUtilisateur = (req, res) => {
    const idUtilisateur = req.params.idUtilisateur;
    if (!idUtilisateur)
        res.status(500).send({message: "Erreur, idUser null"});
    else {
        getCVFileUtilisateurBD(idUtilisateur, (err, data) => {
            if (err)
                err.erreur === "not_found" ? res.status(404).send({message: 'Utilisateur ou CV non trouvé'}) : res.status(500).send({message: "Erreur"});
            else {
                res.sendFile(data.CVFile, {root: 'public/CVfiles/'})
            }
        })
    }
}

/**
 * Méthode pour mettre à jour les informations d'un utilisateur
 * @param req Request de ExpressJS
 * @param res Response de ExpressJS
 */
export const updateUserData = (req, res) => {
    const {nom, email, photoProfile, idUtilisateur} = req.body;
    let {prenom, description, cvFile} = req.body;

    if (!nom || !email || !photoProfile || !idUtilisateur)
        return res.sendStatus(401)

    if (prenom == null)
        prenom = "null";
    if (description == null)
        description = "null";
    if (cvFile == null)
        cvFile = "null";

    try {
        updateUtilisateur([nom, prenom, email, photoProfile, description, cvFile, idUtilisateur]);
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.status(403).json({"faillure": err}).send();
    }
}
export const updateUserDataParam = (req, res) => {
    const {champ, valeur} = req.body;
    try {
        updateUserDataParamBD([champ, valeur]);
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.status(403).json({"faillure": err}).send();
    }
}


export const updatePassword = (req, res) => {
    const {oldPassword, newPassword, newPassword2, idUtilisateur} = req.body;
    if (!oldPassword || !newPassword || !newPassword2 || !idUtilisateur)
        return res.sendStatus(401)

    findPassWordByIdUtilisateur(idUtilisateur, (err, data) => {
        if (err) {
            err.erreur === "not_found" ? res.status(404).send({message: 'Utilisateur non trouvé'}) : res.status(500).send({message: "Erreur"});
        } else {
            if (data.MotDePasse === getHashedPassword(oldPassword)) {
                if (newPassword === newPassword2) {
                    updatePasswordBDD([getHashedPassword(newPassword), idUtilisateur]);
                    res.sendStatus(201);
                } else {
                    res.status(403).json({"faillure": "Les deux mots de passe ne correspondent pas"}).send();
                }
            } else {
                res.status(403).json({"faillure": "Le mot de passe actuel n'est pas correct"}).send();
            }
        }
    });
}


/**
 * Fonction permettant de créer un token d'authentification
 * @param email {string} Email de l'utilisateur
 * @param date {number} Timestamp
 * @returns {string} Le token hashé et en base64 composé d'une random string + email + timestamp
 */
const getToken = (email, date) => {
    return getHashedPassword(crypto.randomBytes(48).toString() + email + date.toString());
}

/**
 * Fonction permettant de transformer une string en un hash sha256 en base64
 * @param password {string} La string à transformer
 * @returns {string} La string hashée et en base 64
 */
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    return sha256.update(password).digest('base64');
}

