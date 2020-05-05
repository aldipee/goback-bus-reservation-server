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

const insert = (userId, nominal) => {
  return new Promise((resolve, reject) => {
    if (userId && nominal) {
      db.query(
        `INSERT INTO topup (id_user,nominal) VALUES('${userId}', '${nominal}')`,
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
 * Get Top Up by id
 * @param {Number} idBuses Id bus as Identifier
 * @returns {Object} of Bus data. [Bus Name, Total Seat, Agent ID, Created By, ID Bus]
 */
const topUpDetail = (idTopUp) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM topup WHERE id='${idTopUp}'`
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
const updateStatus = (idTopUp) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE topup SET status_trx= 1 WHERE id='${idTopUp}'`
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

const getAllTopup = (conditions) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT topup.id,topup.nominal, topup.id_user, topup.status_trx, topup.create_at, topup.update_at, userdetails.fullName, userdetails.avatar,userdetails.balance  FROM topup JOIN userdetails ON topup.id_user = userdetails.userId`
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
  getAllTopup,
  topUpDetail,
  updateStatus
}
