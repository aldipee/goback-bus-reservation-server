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
        `INSERT INTO routes (destination, origin, distance, created_by) VALUES ('${destination}','${origin}','${distance}','${createdBy}')`,
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

module.exports = {
  getAll,
  insert
}
