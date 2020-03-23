const router = require('express').Router()
const AuthController = require('../controllers/Auth')
const AuthMiddleware = require('../middleware/Auth')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/verify', AuthController.verify)
router.get('/logout', AuthMiddleware.validAuthToken, AuthController.logout)
module.exports = router
