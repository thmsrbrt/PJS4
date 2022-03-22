import {findAllByIDConversation} from "../models/Message.js";

export const findAllMessageByIDConversation = (req, res) => {
    if (req.params.idConversation === null) {
        res.status(500).send({message: "Erreur, idConversation null"});
    } else {
        findAllByIDConversation(req.params.idConversation, (err, data) => {
            if (err) {
                err.erreur === "not_found" ? res.status(404).send({message: 'Messages non trouvées'}): res.status(500).send({message: "Erreur"});
            } else {
                res.status(200).send(data);
            }
        });
    }
}
