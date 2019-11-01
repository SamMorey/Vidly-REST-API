const {Genre, validateGenre} = require('../models/genre');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const validateObjectId = require('../middleware/validateObjectid');
const validate = require('../middleware/validate');

router.get('/', asyncMiddleware(async (req, res) => {
  //throw new Error('Something Failed');
  const genres = await Genre
    .find()
    .sort({name: 1})
    .select({name: 1});
  res.send(genres);
}));

router.post('/', [auth, validate(validateGenre)], asyncMiddleware(async (req, res) => {
  const check = await Genre
    .find({name: req.body.name});

  if (check === undefined || check.length === 0) {
    const genre = new Genre ({name: req.body.name});
    try {
      const result = await genre.save();
      res.send(result);
    }
    catch (err) {
      for (field in err.errors)
        console.log(err.errors[field]); 
    }
  }
  else {
    res.send('Error Genre already exists, use put');
    return;
  }

}));

router.put('/:id', [auth, validate(validateGenre)], async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  genre.set({
    name: req.body.name
  });
  try {
    result = await genre.save();
    res.send(result);
  }
  catch (err) {
    for (field in err.errors)
        console.log(err.errors[field]);
  }
});
/* Can also use this form
   const genre = await Genre.FindByIdAndUpdate(req.params.id, {name: req.body.name, new:true})*/

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});



module.exports = router;