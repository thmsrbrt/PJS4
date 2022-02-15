const DB = require('../models/UtilisateurModel')

exports.accueil = (req, res) => {
    res.set('Content-Type', 'text/html')
    res.write('<p>');
    if (req.user)
        res.write("Logged");
    else
        res.write("Not logged in");
    console.log(req.user);
    res.write('</p>');
    res.status(200).end('<a href="http://localhost:3000/user/login/github/">login github</a>')
}

exports.connexion =(req, res) => {
    console.log(req.query.email);
    console.log(req.query.password);
    DB.findOneUtilisateurByEmailPSD(req.query, res);
}

exports.connexionErreur = (req, res) => {
    res.status(500).send('Erreur de connexion');
}

exports.deconnexion = (req, res) => {
    req.logout();
    res.redirect('/user');
}