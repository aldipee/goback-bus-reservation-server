const router = require('express').Router()

const UsersModel = require('../models/User')

router.post('/register', async (req, res) => {
  // make sure client has requiest
  if (req.body) {
    const { username, password, email } = req.body
    try {
      const isRegisterSuccess = await UsersModel.insert(username, password, email, 3)
      isRegisterSuccess
        ? res.status(201).send({ success: true, data: isRegisterSuccess })
        : res.status({ success: false, msg: 'Error' })
    } catch (error) {
      res.status(401).send({ status: 'ERR', error })
    }
  }
})

module.exports = router
