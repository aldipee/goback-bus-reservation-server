const TopUpModel = require('../models/TopUp')
const UserModel = require('../models/User')

module.exports = {
  updateTopUp: async (req, res) => {
    try {
      if (req.params) {
        const idTopUp = req.params.id
        const topUpDetail = await TopUpModel.topUpDetail(idTopUp)
        console.log(topUpDetail)
        if (!topUpDetail.status_trx) {
          const result = await TopUpModel.updateStatus(idTopUp)
          console.log(result)
          if (result) {
            res.send({ success: true, status: 200, message: 'Request Success!' })
          } else {
            res.send({ success: false, status: 400, message: 'Failed Update Status' })
          }
        } else {
          res.send({ success: false, status: 400, message: 'Already Update' })
        }
      } else {
      }
    } catch (error) {
      console.log(error)
    }
  },
  allTopUp: async (req, res) => {
    try {
      let { limit, sort, search, page, show } = req.query
      limit = parseInt(limit) || 5

      page = parseInt(page) || 1
      sort = (sort && { key: sort.key, value: sort.value }) || { key: 'origin', value: 1 }
      search = (search && { key: 'origin', value: search.value }) || { key: 'origin', value: '' }

      const conditions = { limit, page, search, sort, show }

      const result = await TopUpModel.getAllTopup(conditions)

      conditions.nextLink =
        page >= conditions.totalPage ? null : process.env.APP_URL.concat(`routes?page=${page + 1}`)
      conditions.prevLink = page <= 1 ? null : process.env.APP_URL.concat(`routes?page=${page - 1}`)
      delete conditions.search
      delete conditions.sort
      result
        ? res.status(200).send({
            status: 'Ok',
            pageInfo: conditions,
            data: result
          })
        : res.status(500).send({ status: 'FAILED', statusCode: 500 })
    } catch (error) {
      console.log(error)
    }
  },
  addTopUp: async (req, res) => {
    if (req.user && req.user.userRole === 3) {
      if (req.body) {
        const { nominal } = req.body
        const result = await TopUpModel.insert(req.user.userId, nominal)
        result
          ? res.status(200).send({ status: 'OK', message: 'Top Up Request inserted' })
          : res.status(500).send({ status: 'FAILED', statusCode: 500 })
      } else {
        res.status(400).send({ status: 'FAILED', message: 'INVALID REQUEST' })
      }
    } else {
      res.status(401).send({ status: 401, message: 'UNAUTHORIZATION' })
    }
  },
  updateRoute: async (req, res) => {
    if (req.user.userRole === 1) {
      try {
        const { idRoute } = req.params
        const prevData = await RouteModel.getRouteById(idRoute)
        const data = {
          destination: req.body.destination || prevData.destination,
          destinationCode: req.body.destinationCode || prevData.destination_code,
          origin: req.body.origin || prevData.origin,
          originCode: req.body.originCode || prevData.origin_code,
          distance: req.body.distance || prevData.distance
        }
        const result = await RouteModel.updateRouteById(idRoute, data)
        result
          ? res.status(200).send({ status: 'OK', message: 'Route updated' })
          : res.status(404).send({ status: 'FAILED', message: 'ROUTE NOT FOUND' })
      } catch (error) {
        console.log(error, 'THIS ERRO COMES FROM ROUTE ROUTER')
      }
    } else {
      res.status(401).send({ status: 'FORBIDDEN' })
    }
  },
  deleteRoute: async (req, res) => {
    try {
      if (req.user.userRole === 1) {
        const result = await RouteModel.deleteRouteById(req.params.idRoute)
        result
          ? res.status(200).send({ status: 'OK', message: 'Route deleted' })
          : res.status(404).send({ status: 'FAILED', message: 'ROUTE NOT FOUND' })
      } else {
        res.status(401).send({ status: 'FORBIDDEN' })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
