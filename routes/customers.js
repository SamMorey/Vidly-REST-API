const {Customer, validateCustomer} = require('../models/customer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');


router.get('/', async (req, res) => {
    const customer = await Customer
    .find()
    .sort({name: 1});
    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer);
});

router.post('/', auth, async (req, res) => {
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const check = await Customer
      .find({name: req.body.name});
    if (check === undefined || check.length === 0) {
        const customer = new Customer ({
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        });
        try {
            const result = await customer.save();
            res.send(result);
        }
        catch (err) {
        for (field in err.errors)
            console.log(err.errors[field]);
        }
    }
    else {
      res.status(303).send(check);
      return;
    }
  
});

router.put('/:id', auth, async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('The genre with the given ID was not found.');
    const { error } = validateCustomer(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    customer.set({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });
    try {
        result = await customer.save();
        res.send(result);
    }
    catch (err) {
        for (field in err.errors)
            console.log(err.errors[field]);
    }
});

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID could not be found');
    res.send(customer);
});

module.exports = router;





