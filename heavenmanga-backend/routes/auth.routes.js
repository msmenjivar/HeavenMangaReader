// heavenmanga-backend/routes/auth.routes.js
const express = require('express');
const authController = require('../controllers/auth.controller');
const verifySignUp = require('../middlewares/verifySignUp');
const router = express.Router();

// Define routes
router.post('/register', verifySignUp.checkDuplicateEmail, authController.register); // Registration.
router.post('/login', authController.login); // Login.

module.exports = router;