const { check } = require('express-validator');

exports.register = [
    check('phone','Name is Required').not().isEmpty(),
]

