const db = require('../utils/db')

/**
 * All Rotues Avaiable
 * @returns {array_of_object} All routes
 */

const getAll = conditions => {
  const { page, limit, sort, search, show } = conditions
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM routes WHERE ${search.key} LIKE '%${search.value}%' ORDER BY
    ${sort.key} ${sort.value ? 'ASC' : 'DESC'} ${
      !show == 'all' ? `LIMIT ${limit} OFFSET ${(page - 1) * limit}` : ''
    }
    `
    console.log(query)
    db.query(query, (err, results, field) => {
      if (err) {
        reject(err)
      } else {
        results ? resolve(results) : resolve(false)
      }
    })
  })
}

const totalRoutes = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as total FROM routes`
    db.query(query, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result[0])
      }
    })
  })
}

/**
 * Insert new destination
 * @todo Validation for Parameters
 * @param {Object} destination City with 3 Code Example : {full : 'Jakarta', code : 'JKT'}
 * @param {Object} origin City with 3 Code Example : {full : 'Jakarta', code : 'JKT'}
 * @param {number} distance Number
 * @param {number} createdBy User's Sessions
 * @return {boolean} If success will return true, otherwise false
 */
const insert = (destination, origin, distance, createdBy) => {
  distance = parseInt(distance)
  createdBy = parseInt(createdBy)
  if (destination && origin && distance && createdBy) {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO routes (destination,destination_code, origin, origin_code, distance, created_by)
         VALUES ('${destination.full}','${destination.code}', '${origin.full}','${origin.code}','${distance}','${createdBy}')`,
        (err, results, field) => {
          if (err) {
            reject(err)
          } else {
            results ? resolve(true) : resolve(false)
          }
        }
      )
    })
  }
}

/**
 * Get routes data based on Route ID
 * @todo Add Validation for parameter
 * @param {Number} routeId ID route its self as identifier
 * @returns {Object} Route information [Destination, Origin, Distance, createdBy]
 */
const getRouteById = routeId => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM routes WHERE id = '${routeId}'`
    db.query(query, (err, result) => {
      if (err) {
        reject(err)
      } else {
        result.length ? resolve(result[0]) : resolve(false)
      }
    })
  })
}

/**
 * Update Route based on Route ID
 * @todo Add Validationd for all parameters
 * @param {Number} routeId
 * @param {Object} objData Data for update
 * @returns {Boolean} If data updated will return true, otherwise false
 */
const updateRouteById = (routeId, objData) => {
  return new Promise((resolve, reject) => {
    const { destination, destinationCode, origin, originCode, distance } = objData
    const query = `UPDATE routes SET destination='${destination}', destination_code='${destinationCode}', 
    origin='${origin}', origin_code= '${originCode}', distance= '${distance}' WHERE id = '${routeId}'`
    db.query(query, (err, result) => {
      if (err) {
        reject(err)
        console.log(err)
      } else {
        result.changedRows ? resolve(true) : resolve(false)
      }
    })
  })
}

/**
 *  Delete data based on Route ID
 * @param {Number} routeId as Identifier
 * @returns {Boolean} If route deleted will return true, otherwise false
 */
const deleteRouteById = routeId => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM routes WHERE id = '${routeId}'`
    db.query(query, (err, result) => {
      if (err) {
        reject(err)
        console.log(err)
      } else {
        result ? resolve(true) : resolve(false)
      }
    })
  })
}

module.exports = {
  getAll,
  insert,
  updateRouteById,
  getRouteById,
  deleteRouteById,
  totalRoutes
}
