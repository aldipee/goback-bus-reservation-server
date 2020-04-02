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

const insert = (name, totalSeat, agentId, createdBy, picture) => {
  return new Promise((resolve, reject) => {
    if (name && totalSeat && agentId && createdBy) {
      db.query(
        `INSERT INTO buses (name, total_seat, agent_id, created_by, picture) VALUES ('${name}','${totalSeat}','${agentId}','${createdBy}', '${picture}')`,
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

/**
 * Bus Data based on ID bus
 * @param {Number} idBuses Id bus as Identifier
 * @returns {Object} of Bus data. [Bus Name, Total Seat, Agent ID, Created By, ID Bus]
 */
const busDataById = idBuses => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM buses WHERE id='${idBuses}'`
    db.query(query, (err, results) => {
      if (err) {
        reject(err)
      } else {
        results.length ? resolve(results[0]) : resolve(0)
      }
    })
  })
}

/**
 *
 * @todos Add Validation on each parameters
 * @param {Number} idBuses ID bus as Identifier
 * @param {String} busName Bus name
 * @param {Number} totalSeat Input from request
 * @param {Number} agentId From user's sessions
 * @returns {Boolean} If Successfully will return true, otherwise false
 */
const update = (idBuses, busName, totalSeat, agentId, picture) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE buses SET name='${busName}', total_seat='${totalSeat}', picture='${picture}' WHERE id='${idBuses}'
    AND agent_id = '${agentId}'`
    db.query(query, (err, results, field) => {
      if (err) {
        reject(err)
      } else {
        console.log(results)
        results.changedRows ? resolve(results) : resolve(false)
      }
    })
  })
}
/**
 * Bus Data based on Agent Id
 * @param {Number} AgentId Agent ID as Identifier
 * @returns {Object} of Bus data. [Bus Name, Total Seat, Agent ID, Created By, ID Bus]
 */
const getBusByAgentId = agentId => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM buses WHERE agent_id='${agentId}'`
    db.query(query, (err, results) => {
      if (err) {
        reject(err)
      } else {
        results.length ? resolve(results) : resolve(0)
      }
    })
  })
}

module.exports = {
  insert,
  update,
  busDataById,
  getBusByAgentId
}
