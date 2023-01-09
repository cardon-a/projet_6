const sauce = require('../models/sauce');
const Sauce = require('../models/sauce');

exports.sauceAll = (req, res, next) => {
    sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.sauceId = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.sauceAdd = (req, res, next) => {
    delete req.body._id;
    console.log(req.body.name);
    const sauce = new Sauce({
        ...req.body,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error = res.status(400).json({ error }));
};

exports.sauceUpdate = (req, res, next) => {
    sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.sauceDelete = (req, res, next) => {
    sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.sauceLike = (req, res, next) => {

};