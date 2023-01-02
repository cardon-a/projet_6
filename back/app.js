const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://piiquante:piiquante@piiquante.lk2emay.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))
;

const Sauce = require('./models/sauce');
const User = require('./models/users');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

app.post('/api/auth/signup', (req, res) => {
    const user = new User({
        ...req.body
    });
    user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur enregistré !'}))
        .catch(error = res.status(400).json({ error }));
});

app.post('/api/sauces', (req, res) => {
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error = res.status(400).json({ error }));
});

module.exports = app;