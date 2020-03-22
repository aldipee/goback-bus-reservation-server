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

const allSchedule = (route, conditions) => {
  return new Promise((resolve, reject) => {
    let { page, limit, sort, date } = conditions
    page = page || 1
    const perPage = limit || 5
    sort = { key: sort.key, value: parseInt(sort.value) } || { key: 'id', value: 1 }
    console.log('FC', route)
    const query = `SELECT schedules.id, schedules.time, schedules.date, agents.name as agent, buses.name as bus_name ,  routes.origin,routes.origin_code,routes.destination,routes.destination_code, routes.distance,  price.price, buses.total_seat  
    FROM schedules JOIN routes ON schedules.route_id = routes.id JOIN buses ON schedules.bus_id = buses.id 
    JOIN agents ON schedules.agent_id = agents.id JOIN price ON price.route_id = routes.id 
    AND price.agent_id = agents.id WHERE ${
      route.idRoute
        ? `schedules.route_id = ${route.idRoute}`
        : `routes.origin_code = '${route.originCode}' AND routes.destination_code = '${route.destinationCode}`
    }' AND schedules.date = '${date}' ORDER BY
    ${sort.key} ${sort.value ? 'ASC' : 'DESC'} LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`
    console.log(query)
    console.log(sort.value)
    db.query(query, (err, results, field) => {
      if (err) {
        reject(err)
      } else {
        // console.log('SCHEDULES MODEL :', results)
        results ? resolve(results) : resolve(new Error('Data not found'))
      }
    })
  })
}

const totalSchedule = (route, date) => {
  const query = `SELECT COUNT (*) as total
  FROM schedules JOIN routes ON schedules.route_id = routes.id JOIN buses ON schedules.bus_id = buses.id 
  JOIN agents ON schedules.agent_id = agents.id JOIN price ON price.route_id = routes.id 
  AND price.agent_id = agents.id WHERE ${
    route.idRoute
      ? `schedules.route_id = ${route.idRoute}`
      : `routes.origin_code = '${route.originCode}' AND routes.destination_code = '${route.destinationCode}`
  }'  AND schedules.date = '${date}' `
  return new Promise((resolve, reject) => {
    db.query(query, (err, results, field) => {
      if (err) {
        reject(err)
      } else {
        // console.log('SCHEDULES MODEL :', results)
        results ? resolve(results[0].total) : resolve(new Error('Data not found'))
      }
    })
  })
}

module.exports = {
  create,
  allSchedule,
  totalSchedule
}
