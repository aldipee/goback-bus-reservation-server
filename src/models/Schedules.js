const db = require('../utils/db')

/**
 * Insert Schedules data
 * @param {Date} time Depature time string data source from client
 * @param {Number} routeId ID Route source come from client
 * @param {Number} busId ID bus, source form Client
 * @param {Number} agentId ID Agent. source from session
 * @param {Number} createdBy ID users who created the data. Source from session
 * @returns {boolean}
 */

const create = (time, routeId, busId, agentId, createdBy) => {
  if (time && routeId && busId && agentId && createdBy) {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO schedules (time, route_id, bus_id, agent_id, created_by) VALUES('${time}','${routeId}','${busId}','${agentId}','${createdBy}')`,
        (err, results, field) => {
          if (err) {
            reject(err)
          } else {
            results ? resolve(true) : resolve(false)
          }
        }
      )
    })
  } else {
    return new Error('Parameter for create Schedules is Incorrect')
  }
}

const allSchedule = routeId => {
  return new Promise((resolve, reject) => {
    const query = `SELECT schedules.id, schedules.create_at, schedules.time, routes.origin,routes.destination, routes.distance, buses.name, buses.total_seat, agents.name, price.price FROM schedules JOIN routes ON schedules.route_id = routes.id JOIN buses ON schedules.bus_id = buses.id JOIN agents ON schedules.agent_id = agents.id JOIN price ON price.route_id = routes.id AND price.agent_id = agents.id WHERE schedules.route_id = ${routeId}`
    db.query(query, (err, results, field) => {
      if (err) {
        reject(err)
      } else {
        results ? resolve(results) : resolve(new Error('Data not found'))
      }
    })
  })
}

module.exports = {
  create,
  allSchedule
}
