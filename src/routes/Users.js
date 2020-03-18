const router = require('express').Router()
const UserModel = require('../models/User')
const message = require('../utils/message')

// get all users data
router.get('/', async (req, res) => {
  const results = await UserModel.getAllUsersData()
  try {
    const data = results.data.map((element, index) => {
      delete element.password
      return element
    })
    res.status(200).send({ status: 'OK', data })
  } catch (err) {
    res.status(500).send({ success: false, err })
  }
})

// Update users data
router.patch('/:id', async (req, res) => {
  if (req.body) {
    const { id } = req.params
    const { username, password, email } = req.body
    const results = UserModel.update(id, username, password, email)
    results
      ? res.status(200).send({ status: message.req200, msg: 'Success update data' })
      : res.status(500).send({ message: 'error update data' })
  } else {
    res.status(400).send({ status: message.req400 })
  }
})
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const results = await UserModel.remove(id)
  results
    ? res.status(200).send({ status: message.req200, msg: 'Success delete data' })
    : res.status(401).send({ status: 'err' })
})

module.exports = router
