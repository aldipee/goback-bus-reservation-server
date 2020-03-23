const UserModel = require('../models/User')
const message = require('../utils/message')

module.exports = {
  // get All users data
  allData: async (req, res) => {
    // get all data
    if (req.user.userRole === 1) {
      let { search, sort, sortBy, page, perPage } = req.query
      search = search || ''
      sort = sort || 0
      sortBy = sortBy || 'id'
      page = page || 1
      perPage = perPage || 5

      const conditions = { search, sort, sortBy, page, perPage }

      const results = await UserModel.getAllUsersData(conditions)
      try {
        // in order to send data to client, we hava to delete some creditial info from the object
        const data = results.data.map((element, index) => {
          delete element.password
          return element
        })
        res.status(200).send({ status: 'OK', totalData: data.length, data })
      } catch (err) {
        res.status(500).send({ success: false, err })
      }
    } else {
      res.status(403).send({ success: false, message: 'FORBIDEN' })
    }
  },
  // update user data
  update: async (req, res) => {
    if (req.body && req.user) {
      // get id from params
      const { id } = req.params
      const { username, password, email } = req.body
      const results = UserModel.update(id, username, password, email)
      results
        ? res.status(200).send({ status: message.req200, msg: 'Success update data' })
        : res.status(500).send({ message: 'error update data' })
    } else {
      res.status(400).send({ status: message.req400 })
    }
  },
  // delete user
  delete: async (req, res) => {
    if (req.user.userRole === 1) {
      const { id } = req.params
      const results = await UserModel.remove(id)
      results
        ? res.status(200).send({ status: message.req200, msg: 'Success delete data' })
        : res.status(401).send({ status: 'err' })
    } else {
      res.status(403).send({ status: 403, message: 'FORBIDDEN' })
    }
  }
}
