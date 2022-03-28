import {
    addExperienceByIdUtilisateur, deletExperienceByIdExperience,
    findAllExperienceByIdUtilisateur, findExperienceByIdExperience,
    updateExperienceByIdExperience
} from "../models/Experience.js";
import {NULL} from "mysql/lib/protocol/constants/types.js";

export const experienceHandler = (req, res) => {
    const idUtilisateur = req.params.idUtilisateur;
    const {dateDebut, societe, poste, type} = req.body;
    let {dateFin} = req.body;
    if (!idUtilisateur || !dateDebut || !societe || !poste || !type) {
        res.status(500).send({message: "Erreur, Tout les champ sont obligatoire"});
    }
    if (dateFin === "" || dateFin === null || dateFin === undefined) {
        dateFin = null;
    }
    try {
        addExperienceByIdUtilisateur([idUtilisateur, dateDebut, dateFin, societe, poste, type]);
        res.status(200).send({message: "Experience ajouté"});
    } catch (err){
        res.status(500).send({message: "Erreur, Experience n'a pas été ajouté"});
    }
}

export const updateExperience = (req, res) => {
    const {idExperience} = req.body;
    const {dateDebut, societe, poste} = req.body;
    let {dateFin} = req.body;
    if (!idExperience || !dateDebut || !societe || !poste) {
        res.status(500).send({message: "Erreur, Tout les champ sont obligatoire"});
    }
    if (dateFin === "" || dateFin === null || dateFin === undefined) {
        dateFin = -1;
    }
    try {
        updateExperienceByIdExperience([dateDebut, dateFin, societe, poste, idExperience]);
        res.status(200).send({message: "Experience mise à jour"});
    } catch (err){
        res.status(500).send({message: "Erreur, Experience n'a pas pu être mise à jour"});
    }
}

export const getAllExperiencesUser = (req, res) => {
    const {idUtilisateur} = req.params;
    if (!idUtilisateur) {
        res.status(500).send({message: "Erreur, Tout les champ sont obligatoire"});
    }

    findAllExperienceByIdUtilisateur(idUtilisateur, (err, data) => {
        if (err) {
            err.erreur === "not_found" ? res.status(404).send({message: 'Experience non trouvée'}) : res.status(500).send({message: "Erreur"});
        } else {
            res.status(200).send(data);
        }
    });
}

export const getExperienceByIdExperience = (req, res) => {
    const {idExperience} = req.params;
    if (!idExperience) {
        res.status(500).send({message: "Erreur, idExperience = null"});
    }

    findExperienceByIdExperience(idExperience, (err, data) => {
        if (err) {
            err.erreur === "not_found" ? res.status(404).send({message: 'Experience non trouvée'}) : res.status(500).send({message: "Erreur"});
        } else {
            res.status(200).send(data);
        }
    });
}

export const deleteExperienceByIdExperience = (req, res) => {
    const {idExperience} = req.params;
    if (!idExperience) {
        res.status(500).send({message: "Erreur, idExperience = null"});
    }
    try {
        deletExperienceByIdExperience(idExperience);
        res.status(200).send({message: "Experience supprimé"});
    } catch (err) {
        res.status(500).send({message: "Erreur suppression Experience"});
    }
}