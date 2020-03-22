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

const update = (idBuses, busName, totalSeat, agentId) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE buses SET name='${busName}', total_seat='${totalSeat}' WHERE id='${idBuses}'
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
