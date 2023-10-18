const express                       = require('express');
const router                        = express.Router();
const verifyTokenMiddleware         = require('../../middleware/auth');
const authController                = require('../../controllers/auth');
const { check, validationResult }   = require('express-validator');




// route -> GET /api/auth
// desc -> returns user data if request contains a valid authentication token
// access -> private - only users with a valid token will be able to retrieve their user data

router.get('/', verifyTokenMiddleware.verifyToken, authController.returnUserData)


// route -> POST /api/auth/login
// desc ->  authenticate user and get token
// access -> public - anyone can view and use so they can get the token to access the private routes

router.post('/login',[
    check('email', "Email address is required").exists(),
    check('password', "Password is required").exists()
], authController.loginUser)


module.exports = router;