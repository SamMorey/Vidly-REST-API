const mongoose = require('mongoose');
const Joi = require('joi');
const {Genre} = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema ({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    genre: {
        type: Genre.schema,
        required: true
    },
    numberInStock: {
        type: Number, 
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min:0,
        max: 255
    }
}));

function validateMovie(movie) {
    const scheme = {
        title: Joi.string().max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    };
    return Joi.validate(movie, scheme);
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;