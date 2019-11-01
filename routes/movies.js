const {Movie, validateMovie} = require('../models/movie');
const {Genre, validateGenre} = require('../models/genre');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');


router.get('/', async (req, res) => {
    const movie = await Movie
    .find()
    .sort({title: 1});
    res.send(movie);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('The movie with the given ID could not be found');
    res.send(movie);
});

router.post('/', auth, async (req, res) => {
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Check to see if Movie is in the DB already
    const check = await Movie
        .find({name: req.body.title});
    
    if(check === undefined || check.length === 0) {
        const genre = await Genre.findById(req.body.genreId);
        if(!genre) return res.status(400).send('Invalid Genre');
        const movie = new Movie ({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });
        try {
            const result = await movie.save();
            res.send(result);
        }
        catch (err) {
            for (field in err.errors)
            console.log(err.errors[field]);
        }
    }
    else {
        res.send.status(303).send(check);
    }
});

router.put('/:id', auth, async (req,res) => {
    const{error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const genre = Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid Genre');
    const movie = await Movie.findOneAndUpdate({_id: req.params.id},
        {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        },
        {new: true}
    );
    if(!movie) res.send.status(404).send('The movie with the specified Id could not be found');

    res.send(movie);
});

router.delete('/:id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if(!movie) res.send.status(404).send('The movie with the specified Id could not be found');
    res.send(movie);
});

module.exports = router;