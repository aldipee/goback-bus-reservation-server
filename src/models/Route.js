const db = require('../utils/db')

/**
 * Get All Routes
 * @returns {array_of_object}
 */

const getAll = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM routes', (err, results, field) => {
      if (err) {
        reject(err)
      } else {
        results ? resolve(results) : resolve(false)
      }
    })
  })
}

/**
 * Insert new destination
 * @param {string} destination
 * @param {string} origin
 * @param {number} distance
 * @param {number} createdBy
 * @return {boolean}
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
  deleteRouteById
}
