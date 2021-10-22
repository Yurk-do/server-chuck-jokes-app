const express = require('express');
const router = express.Router();
const authUserController = require('../controllers/auth.controller');

router.post('/login', authUserController.login);
router.post('/register', authUserController.register);
router.get('/auth', authUserController.auth);

module.exports = router;
