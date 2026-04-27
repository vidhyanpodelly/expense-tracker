const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  authController.register
);

router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;
