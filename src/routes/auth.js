const express = require('express');
const router = express.Router();
const { User } = require('../models/user')
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/', async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email or password.');

    const isValid = bcrypt.compare(req.body.password, user.password);
    const token = user.genrateToken();
    if(isValid) res.header('x-auth-token', token).render('index', {
        title: 'Home - Page',
        message: 'Login success.'
    });
    else return res.status(400).send('Invalid email or password.');
});

function validate(user) {
    const schema = Joi.object({
        email: Joi.string().min(7).max(30).required().email(),
        password: Joi.string().min(8).required()
    })
}

module.exports = router;