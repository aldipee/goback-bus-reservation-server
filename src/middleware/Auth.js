const jwt = require('jsonwebtoken')

module.exports = {
  validAuthToken: (req, res, next) => {
    console.log(req.headers)
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
      try {
        let token = authorization.slice(7, authorization.length)
        token = jwt.verify(token, process.env.AUTH_KEY)
        if (token) {
          req.user = token
          next()
        } else {
          res.status(403).send({ status: 403, message: 'Unauthorization' })
        }
      } catch (error) {
        res.status(500).send({ status: 500, message: error })
      }
    } else {
      res.status(403).send({ status: 403, message: 'Authorization needed' })
    }
  }
}
