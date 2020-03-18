const UserModel = require('../models/User')
const message = require('../utils/message')

module.exports = {
  // get All users data
  allData: async (req, res) => {
    // get all data
    const results = await UserModel.getAllUsersData()
    try {
      // in order to send data to client, we hava to delete some creditial info from the object
      const data = results.data.map((element, index) => {
        delete element.password
        return element
      })
      res.status(200).send({ status: 'OK', data })
    } catch (err) {
      res.status(500).send({ success: false, err })
    }
  },
  // update user data
  update: async (req, res) => {
    if (req.body) {
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
    const { id } = req.params
    const results = await UserModel.remove(id)
    results
      ? res.status(200).send({ status: message.req200, msg: 'Success delete data' })
      : res.status(401).send({ status: 'err' })
  }
}
