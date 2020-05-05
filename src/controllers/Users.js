const UserModel = require('../models/User')
const ReservationModel = require('../models/Reservations')
const message = require('../utils/message')

module.exports = {
  singleUserProfile: async (req, res) => {
    if (!req.user) {
      res.send({ status: 'Authorization Needed!' })
    } else {
      let { show, limit, page, sort, sortBy } = req.query
      limit = limit || 5
      page = page || 1
      const conditions = {
        page,
        limit,
        // Sort by fullName, time, date
        sort: (sort && sortBy && { key: sortBy, value: sort }) || { key: 'fullName', value: 1 }
      }

      const { id } = req.params
      const data = await UserModel.getUserDetails(id)
      data.avatar = `//${process.env.APP_HOST}:${process.env.APP_PORT}${process.env.PUBLIC_URL}users/${data.avatar}`
      const currentTicket = await ReservationModel.getUserReservation(id, 0, conditions)

      res.status(200).send({
        status: 'OK',
        profileData: data,
        reservationsData: currentTicket
      })
    }
  },
  userDetail: async (req, res) => {
    if (!req.user) {
      res.status.send({ status: 'NEED LOGIN TO ACCESS THIS PAGE' })
    } else {
      if (await UserModel.isProfileCompleted(req.params.id)) {
        let { show, limit, page, sort, sortBy } = req.query
        limit = limit || 5
        page = page || 1
        const conditions = {
          page,
          limit,
          // Sort by fullName, time, date
          sort: (sort && sortBy && { key: sortBy, value: sort }) || { key: 'fullName', value: 1 }
        }
        show = show || 'all'
        const { userId } = req.user
        const currentTicket = await ReservationModel.getUserReservation(userId, 0, conditions)

        const data = {
          status: 'OK',
          yourReservation: currentTicket
        }

        res.status(200).send(data)
      }
    }
  },

  userHistory: async (req, res) => {
    console.log(req.user)
    if (!req.user) {
      res.status.send({ status: 'NEED LOGIN TO ACCESS THIS PAGE' })
    } else {
      if (await UserModel.isProfileCompleted(req.user.userId)) {
        let { show, limit, page, sort, sortBy } = req.query
        limit = limit || 5
        page = page || 1
        const conditions = {
          page,
          limit,
          // Sort by fullName, time, date
          sort: (sort && sortBy && { key: sortBy, value: sort }) || { key: 'fullName', value: 1 }
        }
        show = show || 'all'
        const { userId } = req.user
        const currentTicket = await ReservationModel.getUserReservation(userId, 0, conditions)
        const pastTicket = await ReservationModel.getUserReservation(userId, 1, conditions)

        const data = {
          status: 'OK',
          yourBooking: currentTicket,
          history: pastTicket
        }
        show === 'booking' && delete data.history
        show === 'history' && delete data.yourBooking
        res.status(200).send(data)
      }
    }
  },

  userProfile: async (req, res) => {
    if (!req.user) {
      res.status.send({ status: 'NEED LOGIN TO ACCESS THIS PAGE' })
    } else {
      if (await UserModel.isProfileCompleted(req.user.userId)) {
        const { userId } = req.user
        const data = await UserModel.getUserDetails(userId)
        data.avatar = `//${process.env.APP_HOST}:${process.env.APP_PORT}${process.env.PUBLIC_URL}users/${data.avatar}`
        res.status(200).send({
          status: 'OK',
          msg: `Welcome back ${data.fullName}`,
          profileData: data
        })
      }
    }
  },

  updateUserPicture: async (req, res) => {
    console.log(req.file)
    try {
      // Make sure requests exists
      // const { filename } = req.file
      console.log(req.file)
      const { userId } = req.user

      let avatar = (req.file && req.file.filename) || 'default.png'

      const result = await UserModel.updateUserPicture(userId, avatar)
      const msg = `Avatar updated`
      result
        ? res.status(201).send({
            status: 'OK',
            success: true,
            message: msg
          })
        : res.status(400).send({ status: 400, message: 'BAD REQUEST' })
    } catch (error) {
      console.log(error)
      res.send({ status: 'Error, please try again later' })
    }
  },
  updateUser: async (req, res) => {
    if (req.user) {
      try {
        // Make sure requests exists
        // const { filename } = req.file
        console.log(req.file)
        const { userId } = req.user
        let { fullName, bod, gender, phoneNumber, address, balance } = req.body
        let avatar = (req.file && req.file.filename) || 'default.png'
        // set default balance to 0
        balance = balance || 0
        const result = await UserModel.insertUserDetails(
          userId,
          fullName,
          bod,
          gender,
          phoneNumber,
          address,
          balance,
          avatar
        )
        const msg = `Thank you for completed your data ${fullName}, now you can use all of our services`
        result
          ? res.status(201).send({
              status: 'OK',
              success: true,
              message: msg
            })
          : res.status(400).send({ status: 400, message: 'BAD REQUEST' })
      } catch (error) {
        console.log(error)
        res.send({ status: 'Error, please try again later' })
      }
    } else {
      res.status(403).send({ success: false, message: 'FORBIDEN' })
    }
  },

  // get All users data
  allData: async (req, res) => {
    // get all data
    console.log(req.user)
    if (req.user.userRole === 1) {
      let { search, sort, sortBy, page, limit } = req.query
      search = (search && { key: search.key, value: search.value }) || { key: 'fullName', value: '' }
      sort = sort || 0
      sortBy = sortBy || 'id'
      page = page || 1
      perPage = limit || 5

      const conditions = { search, sort, sortBy, page, perPage }
      console.log(conditions)
      const results = await UserModel.getAllUsersData(conditions)
      const totalAllData = await UserModel.totalUsers()
      conditions.totalPage = Math.ceil(totalAllData.data[0].total / perPage)
      conditions.totalData = totalAllData.data[0].total
      delete conditions.search
      delete conditions.sort
      delete conditions.sortBy
      console.log(totalAllData)
      try {
        // in order to send data to client, we hava to delete some creditial info from the object
        const data = results.data.map((element, index) => {
          delete element.password
          return element
        })
        res.status(200).send({ status: 'OK', pageInfo: conditions, totalData: data.length, data })
      } catch (err) {
        console.log(err)
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
