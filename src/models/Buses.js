const db = require('../utils/db')

/**
 * Insert new Buss
 * @param {string} name Bus name
 * @param {number} totalSeat Total all seat on the bus
 * @param {number} agentId Bus Agent
 * @param {number} routeId Bus Route
 * @param {number} createdBy  Agent who created the new bus
 * @returns {boolean} Created success will return true, otherwise will return false
 */

const insert = (name, totalSeat, agentId, createdBy) => {
  return new Promise((resolve, reject) => {
    if (name && totalSeat && agentId && createdBy) {
      db.query(
        `INSERT INTO buses (name, total_seat, agent_id, created_by) VALUES ('${name}','${totalSeat}','${agentId}','${createdBy}')`,
        (err, results, field) => {
          if (err) {
            reject(err)
          } else {
            results ? resolve(results) : resolve(false)
          }
        }
      )
    } else {
      reject(new Error('Parameter INCORRECT'))
    }
  })
}

module.exports = {
  insert
}
