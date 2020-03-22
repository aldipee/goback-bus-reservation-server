const router = require('express').Router()
const AuthController = require('../controllers/Auth')
const AuthMiddleware = require('../middleware/Auth')
const AuthModel = require('../models/Auth')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/verify', async (req, res) => {
  if (req.query.code && req.query.action) {
    const { code, action } = req.query
    const result = await AuthModel.verifyUser(action, code)
    if (result) {
      res.status(201).send({ status: 'OK', message: 'Your account has been verified' })
    } else {
      res.status(400).send({ status: 'FAILED' })
    }
  } else {
    res.status(400).send({ status: 'BAD REQUEST' })
  }
})
router.get('/logout', AuthMiddleware.validAuthToken, AuthController.logout)
module.exports = router
