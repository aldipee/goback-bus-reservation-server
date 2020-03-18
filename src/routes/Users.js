const router = require('express').Router()
const UserController = require('../controllers/Users')

// get all users data
router.get('/', UserController.allData)

// Update user data
router.patch('/:id', UserController.delete)

// Delete user data
router.delete('/:id', UserController.delete)

module.exports = router
