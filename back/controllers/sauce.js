const Sauce = require('../models/sauce');

const fs = require('fs');

exports.sauceAll = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.sauceId = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.sauceAdd = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    console.log(sauceObject);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    console.log(sauce);
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée.'}))
        .catch(error => res.status(400).json({ error }));
};

exports.sauceUpdate = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifiée.'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.sauceDelete = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //On trouve l'objet dans la base de données
        .then(sauce => { 
            const filename = sauce.imageUrl.split('/images/')[1]; //On extrait le nom du fichier à supprimer
            fs.unlink(`images/${filename}`, () => { //On supprime ce fichier 
                Sauce.deleteOne({ _id: req.params.id }) //Puis on supprime l'objet de la base de données
                    .then(() => res.status(200).json({ message: 'Sauce supprimée.'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.sauceLike = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(likedSauce => {
            switch (req.body.like) {
                case 1:
                    if (!likedSauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, $pull: { usersDisliked: req.body.userId }})
                            .then(() => res.status(201).json({ message: 'Sauce likée.' }))
                            .catch(error => res.status(400).json({ error }));                        
                    }
                    break;
                case -1:
                    if (!likedSauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, $pull: { usersLiked: req.body.userId }})
                            .then(() => res.status(201).json({ message: 'Sauce dislikée.' }))
                            .catch(error => res.status(400).json({ error }));  
                    }
                    break;
                case 0:
                    if (likedSauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }})
                            .then(() => res.status(201).json({ message: 'Annulation du dislike.' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    if (likedSauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }})
                            .then(() => res.status(201).json({ message: 'Annulation du like.' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;
            }
        })
        .catch(error => res.status(404).json({ error }));
};