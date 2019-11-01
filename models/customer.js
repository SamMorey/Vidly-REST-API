const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true,
        default: false
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
}));

function validateCustomer(customer) {
    const scheme = {
        isGold: Joi.boolean().required(),
        name: Joi.string().required(),
        phone: Joi.string().required()
    }

    return Joi.validate(customer, scheme);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;