const DB = require('../models/UtilisateurModel')

exports.accueil = (req, res) => {
    res.set('Content-Type', 'text/html')
    res.write('<p>');
    if (req.user)
        res.write("Logged");
    else
        res.write("Not logged in");
    console.log(req.query.email);
    console.log(req.query.password);
    console.log('test');
    console.log(req.query.id);
    //console.log(req.user);
    res.write('</p>');
    res.status(200).end('' +
        '<a href="http://localhost:3000/user/login/github/">login github</a><br>' +
        '<a href="http://localhost:3000/user/login/facebook/">login facebook</a>');
}

exports.connexion = (req, res) => {
    //console.log(req);
    console.log(req.body.email);
    console.log(req.body.password);
    const profil = [req.body.email, req.body.password];
    DB.findOneUtilisateurByEmailPSD(profil, res);
}

exports.connexionErreur = (req, res) => {
    res.status(500).send('Erreur de connexion');
}

exports.deconnexion = (req, res) => {
    req.logout();
    res.redirect('/user');
}