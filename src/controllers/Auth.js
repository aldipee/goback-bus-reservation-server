const UsersModel = require('../models/User')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
  register: async (req, res) => {
    // make sure client has requiest
    if (req.body) {
      const { username, password, email } = req.body
      const isUsernameAvaiable = await UsersModel.isUsernameExist(username)
      if (!isUsernameAvaiable) {
        // if username not avaiable, then user can register
        try {
          const isRegisterSuccess = await UsersModel.insert(username, password, email, 3)
          isRegisterSuccess
            ? res.status(201).send({ success: true, data: isRegisterSuccess })
            : res.status({ success: false, msg: 'Error' })
        } catch (error) {
          res.status(401).send({ status: 'ERR', error })
        }
      } else {
        res.status(401).send({ status: 'FAILED', msg: 'username already exist' })
      }
    }
  },
  login: async (req, res) => {
    if (req.body) {
      const { username, password } = req.body

      if (!(await UsersModel.isUsernameExist(username))) {
        // if username is not avaiable, user cannot login
        res.status(400).send({ status: 'ERR', msg: 'Invalid username or passsword' })
      } else {
        // otherwies, if username avaiable, get some creditials info form that user
        const userData = await UsersModel.getUserData(username)
        if (userData.is_verified) {
          // if user verified, then countinue to check wether password correct or not
          if (bcrypt.compareSync(password, userData.password)) {
            // if password correct, send token and some basic info to the client
            const token = jwt.sign(
              { userId: userData.id, userRole: userData.role_id, username: userData.username },
              process.env.AUTH_KEY,
              { expiresIn: '20m' }
            )
            res.status(200).send({ status: 'OK', msg: `Welcome back ${userData.username}`, token })
          } else {
            res.status(400).send({ status: 'ERR', msg: 'Invalid username or passsword' })
          }
        } else {
          res.status(403).send({ status: 'NOTVERIFIED', msg: 'Please verify your account' })
        }
      }
    }
  }
}
