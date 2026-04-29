const express = require('express');
const router = express.Router();
const { getUsers, getUserById, deleteUser, getUserStats } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getUserStats);
router.get('/:id', protect, admin, getUserById);
router.delete('/:id', protect, admin, deleteUser);
router.get('/', protect, admin, getUsers);

module.exports = router;