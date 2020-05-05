const UsersModel = require('../models/User')
const AgentsModel = require('../models/Agents')

const AuthModel = require('../models/Auth')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
  register: async (req, res) => {
    // make sure client has requiest
    if (req.body) {
      const { username, password, email } = req.body
      const isUsernameAvaiable = await UsersModel.isUsernameExist(username)
      if (!isUsernameAvaiable) {
        // if username not available, then user can register
        let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)

        if (emailCheck) {
          try {
            const isRegisterSuccess = await UsersModel.insert(username, password, email, 3)
            const userVerifCode = await UsersModel.getUserDataById(isRegisterSuccess.data.insertId)
            const verifyLink = `${process.env.APP_HOST}:${process.env.APP_PORT}/auth/verify?code=${userVerifCode.verified_code}&action=${isRegisterSuccess.data.insertId}`
            isRegisterSuccess.data.insertId
              ? res.status(201).send({ isRegisterSuccess, verifyLink })
              : res.status({ success: false, msg: 'Error' })
          } catch (error) {
            console.log(error)
            res.status(401).send({ status: 'ERR', error })
          }
        } else {
          console.log('AASS')
          res.status(401).send({ success: false, message: 'Email format is invalid', error_code: '1001' })
        }
      } else {
        console.log('AASssssssS')
        res
          .status(401)
          .send({ success: false, status: 'FAILED', message: 'username already exist', error_code: '1002' })
      }
    }
  },
  checkUsername: async (req, res) => {
    // make sure client has requiest
    if (req.body) {
      const { username } = req.body
      console.log(req.body)
      const isUsernameAvaiable = await UsersModel.isUsernameExist(username)
      console.log(isUsernameAvaiable)
      if (!isUsernameAvaiable) {
        // if username not available, then user can register
        try {
          res.status(200).send({ status: 'OK' })
        } catch (error) {
          res.status(401).send({ status: 'ERR', error })
        }
      } else {
        res.status(200).send({ status: 'FAILED', msg: 'username already exist' })
      }
    }
  },

  // User login
  login: async (req, res) => {
    if (req.body) {
      const { username, password } = req.body

      if (!(await UsersModel.isUsernameExist(username))) {
        // if username is not avaiable, user cannot login
        res
          .status(200)
          .send({ success: false, status: 'ERR', msg: 'Invalid username or passsword', error_code: '1003' })
      } else {
        // otherwise, if username avaiable, get some credintials info form that user
        const userData = await UsersModel.getUserData(username)

        if (userData.is_verified) {
          // if user verified, then countinue to check wether password correct or not
          if (bcrypt.compareSync(password, userData.password)) {
            // if password correct, send token and some basic info to the client
            let token
            if (userData.role_id === 1) {
              token = jwt.sign(
                {
                  userId: userData.id,
                  userRole: userData.role_id,
                  role: 'SUPERADMIN',
                  username: userData.username
                },
                process.env.AUTH_KEY,
                { expiresIn: '1d' }
              )
            } else if (userData.role_id === 2) {
              const dataAgent = await AgentsModel.getDataAgent(userData.id)
              token = jwt.sign(
                {
                  userId: userData.id,
                  userRole: userData.role_id,
                  role: 'Agent',
                  username: userData.username,
                  agentId: dataAgent.id
                },
                process.env.AUTH_KEY,
                { expiresIn: '1d' }
              )
            } else {
              token = jwt.sign(
                {
                  userId: userData.id,
                  userRole: userData.role_id,
                  role: 'GENERALUSER',
                  username: userData.username
                },
                process.env.AUTH_KEY,
                { expiresIn: '1d' }
              )
            }
            if (await UsersModel.isProfileCompleted(userData.id)) {
              const data = await UsersModel.getUserDetails(userData.id)
              // Add new Public url for Picture
              data.avatar = `//${process.env.APP_HOST}:${process.env.APP_PORT}${process.env.PUBLIC_URL}users/${data.avatar}`
              res.status(200).send({
                status: 'OK',
                msg: `Welcome back ${data.fullName}`,
                token,
                role: userData.role_id,
                isProfileCompleted: true
              })
            } else {
              res.status(200).send({
                status: 'OK',
                msg: `Welcome back ${userData.username}`,
                token,
                role: userData.role_id,
                isProfileCompleted: false,
                profileData: 'Your profile is not completed. You would not be able to make reservation'
              })
            }
          } else {
            res.status(400).send({
              success: false,
              error_code: '1003',
              status: 'ERR',
              msg: 'Invalid username or passsword'
            })
          }
        } else {
          res.status(200).send({ status: 'NOTVERIFIED', msg: 'Please verify your account' })
        }
      }
    }
  },
  logout: (req, res) => {
    if (req.user) {
      console.log(req.user)
      delete req.user
      res.send({ status: 'OK', message: 'You are logout!' })
      console.log(req.user)
    } else {
      res.send({ status: 'OK', message: 'You already logout' })
    }
  },
  verify: async (req, res) => {
    if (req.query.code && req.query.action) {
      const { code, action } = req.query
      const result = await AuthModel.verifyUser(action, code)
      if (result) {
        res
          .status(201)
          .send({ status: 'OK', message: 'Your account has been verified. Please login to countinue' })
      } else {
        res.status(400).send({
          success: false,
          status: 'FAILED',
          error_code: '1004',
          message: 'Failed to verify your account'
        })
      }
    } else {
      res
        .status(400)
        .send({ success: false, status: 'BAD REQUEST', message: 'Invalid Request', error_code: '1005' })
    }
  },
  token: (req, res) => {
    console.log(req.body.token)
    if (req.body.token.startsWith('Bearer')) {
      let token = req.body.token.slice(7, req.body.token.length)

      token = jwt.verify(token, process.env.AUTH_KEY)
      console.log(token)
      token ? res.send({ valid: true }) : res.send({ valid: false })
    } else {
      console.log('assa')
      res.send({ valid: false, msg: 'token unrecognized' })
    }
  }
}
