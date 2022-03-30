import {
    createAnnonce, deleteAnnonceByIdAnnonce,
    findAllAnnonce,
    findAnnonceByID,
    searchByKeywords,
    updateAnnonceData,
    findCandidatFavoriteAnnonceModel, deleteFavAnnonceModel, findAnnonceByUserIdModel, addFavoriteAnnonceModel
} from "../models/Annonce.js";
import db from "../../config/connexionBDD.js";
import {deletExperienceByIdExperience} from "../models/Experience.js";
import {request} from "express";

/**
 * Méthode pour trouver les informations d'une annonce par son id
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si annonce non trouvé et 200 si trouvé
 */
export const findAnnonce = (req, res) => {
    const idAnnonce = req.params.idAnnonce;
    if (idAnnonce === null) {
        res.status(500).send({message: "Erreur, idAnnonce null"});
    } else {
        findAnnonceByID(idAnnonce, (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: 'Annonce non trouvée'}) : res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    }
}

/**
 * Méthode pour trouver toutes les annonces des entreprises
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si aucunes annonces trouvées et 200 si trouvé
 */
export const findAllAnnonces = (req, res) => {
    findAllAnnonce((err, data) => {
        if (err) {
            err.erreur === "not_found" ? res.status(404).send({message: 'aucune annonce na été trouvé'}) : res.status(500).send({message: "Erreur"});
        } else {
            res.status(200).send(data);
        }
    });
}

/**
 * Méthode pour trouver une annonce en fonction de l'id d'une entreprise
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 500 si erreur, 404 si aucunes annonces trouvées et 200 si trouvé
 */
export const findAnnonceByUserId = (req, res) => {
    const idUtilisateur = req.params.idUtilisateur;
    if (idUtilisateur === null) {
        res.status(500).send({message: "Erreur, idUtilisateur null"});
    } else {
        findAnnonceByUserIdModel(idUtilisateur, (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: 'Annonce non trouvée'}) : res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    }
}


/**
 * Méthode pour créer une annonce
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 * @response Code HTTP 201 si réussite, 403 dans le cas contraire, avec la raison dans le body ("faillure")
 */
export const registerAnnonce = (req, res) => {
    const idEntreprise = req.params.idUtilisateur;
    let {titre, description, localisation, lien} = req.body;
    if(!titre || !description || !idEntreprise || !localisation)
        res.status(500).send({message: "Erreur, toute les informations sont obligatoires"});
    if (!lien) {
        lien = "-1";
    }
    let image=  req.body.image;
    if (image === null || image === undefined || image === "")
        image = "default.png";

    try {
        createAnnonce([titre, image, description, idEntreprise, localisation, lien]);
        res.sendStatus(201);
    } catch (err) {
        res.status(403).json({"faillure": err}).send();
    }
}

/**
 * Méthode pour mettre à jour une annonce
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 */
export const updateAnnonce = (req, res) => {
    const {titre, description, localisation, idAnnonce} = req.body;
    if(!titre || !description || !localisation || !idAnnonce)
        res.status(500).send({message: "Erreur, toute les informations sont obligatoires"});

    let image = req.body.image;
    if (image == null)
        image = "default.png";

    try {
        updateAnnonceData([titre, image, description, localisation, idAnnonce]);
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.status(403).json({"faillure": err}).send();
    }
}


/**
 * Méthode pour trouver les annonces par mots clés
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 */
export const findAnnonceByMotsClefs = async (req, res) => {
    let {motsClefs} = req.params;
    //console.log(motsClefs);
    if (!motsClefs)
        res.status(200).send();
    motsClefs = motsClefs.toLowerCase();

    const criteres = motsClefs.split(';');
    let data = [];

    const promise = new Promise((resolve, reject) => {
        criteres.forEach(
            (critere, index) => {
                searchByKeywords("%" + critere + "%", (err, newData) => {
                    if (err) {
                        reject(err);
                    } else {
                        data = data.concat(newData);
                    }
                    if (index === criteres.length - 1) {
                        resolve(data);
                    }
                });
            }
        )
    })


    promise.then(
        (data) => {
            let datas = [];
            const dataUnique = data.filter((item, pos) => {
                if (datas.indexOf(item.idAnnonce) === -1) {
                    datas.push(item.idAnnonce);
                    return item;
                }
            });
            res.status(200).send(dataUnique);
        }
    ).catch(
        (err) => {
            res.status(500).send({message: "Erreur, lors de la requête"});
        }
    )

}

/**
 * Méthode pour supprimer une annonce par son id
 * @param req Request venant de ExpressJS
 * @param res Response venant de ExpressJS
 */
export const deleteAnnonce = (req, res) => {
    const {idAnnonce} = req.params;
    if (!idAnnonce) {
        res.status(500).send({message: "Erreur, idAnnonce = null"});
    }
    try {
        deleteAnnonceByIdAnnonce(idAnnonce);
        res.status(200).send({message: "Annonce supprimé"});
    } catch (err) {
        res.status(500).send({message: "Erreur suppression Annonce"});
    }
}

export const findCandidatFavoriteAnnonce = (req, res) => {
    const {idUtilisateur} = req.params;
    if (!idUtilisateur) {
        res.status(500).send({message: "Erreur, idCandidat = null"});
    }
    try {
        findCandidatFavoriteAnnonceModel(idUtilisateur, (err, data) => {
            if (err) {
                res.status(500).send({message: "Erreur"});
            } else {
                // console.log(data)
                res.status(200).send(data);
            }
        });
    } catch (err) {
        res.status(500).send({message: "Erreur findCandidatFavoriteAnnonce"});
    }
}

export const addFavAnnonce = (req, res) => {
    const {idUtilisateur, idAnnonce} = req.params;
    if (!idUtilisateur || !idAnnonce) {
        return res.status(500).send({message: "Erreur, idCandidat = null"});
    }
    try {
        addFavoriteAnnonceModel([idUtilisateur, idAnnonce], (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: "aucune annonce n'a été ajoutée"}) : res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    } catch (err) {
        res.status(500).send({message: "Erreur ajout Annonce"});
    }
}

export const deleteFavAnnonce = (req, res) => {
    const {idUtilisateur, idAnnonce} = req.params;
    if (!idUtilisateur || !idAnnonce) {
        return res.status(500).send({message: "Erreur, idCandidat = null"});
    }
    try {
        deleteFavAnnonceModel([idUtilisateur, idAnnonce], (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: "aucune annonce n'a été supprimée"}) : res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    } catch (err) {
        res.status(500).send({message: "Erreur suppression Annonce"});
    }
}