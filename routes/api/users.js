const express                       = require('express');
const router                        = express.Router();
const { check, validationResult }   = require('express-validator');
const usersController               = require('../../controllers/users');


// route -> POST /api/users
// desc -> register a new user
// access -> public - anyone can view and use

router.post('/',[
    check('email', "Please enter a valid email address").isEmail(),
    check('name',"Please enter a name").notEmpty(),
    check('password', "Please enter a password which is 6 characters or more").isLength(6)
], usersController.registerUser)


module.exports = router;