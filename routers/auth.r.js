const express = require('express');
const authController = require('../controllers/auth.c'); 

const router = express.Router();

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.post('/logout', authController.logout);
router.get('/logout', authController.logout);

module.exports = router;