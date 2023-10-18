const express                       = require('express');
const router                        = express.Router();
const profileController             = require('../../controllers/profiles');
const verifyTokenMiddleware         = require('../../middleware/auth');
const { check, validationResult }   = require('express-validator');


//routes

// GET /api/profiles/me         PRIVATE
router.route('/me')
  .get(verifyTokenMiddleware.verifyToken, profileController.getCurrentUserProfile)

// GET      /api/profiles       PUBLIC
// POST     /api/profiles       PRIVATE
router.route('/')
  .get(profileController.getAllProfiles)
  .post([verifyTokenMiddleware.verifyToken, [
    check('status', "Status is required").notEmpty(),
    check('skills', "Skills is required").notEmpty()
  ]], profileController.createProfile)

// GET      /api/profiles/:id   PUBLIC
// PATCH    /api/profiles/:id   PRIVATE
// DELETE   /api/profiles/:id   PRIVATE
router.route('/:id')
  .get(profileController.getProfile)
  .delete(verifyTokenMiddleware.verifyToken, profileController.deleteProfile)
  .patch(verifyTokenMiddleware.verifyToken, profileController.updateProfile)

module.exports = router;