const db = require('../utils/db')

/**
 * Create Agents/ Insert agents to database
 * @todo Add validation for every paramater
 * @todo Add Checking method to check wheter travel aleready exist or not by userId
 * @param {string} name Title or name of the agent
 * @param {number} userId  user that we wanted to convert to agent
 * @param {number} createdBy user that who created the agent
 * @returns {bool} true for Succes false for Failed
 */
const insert = (name, userId, createdBy) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO agents (name, user_id, created_by) VALUES ('${name}','${userId}','${createdBy}')`,
      (err, result, field) => {
        if (err) {
          reject(err)
        } else {
          result.insertId ? resolve(true) : resolve(false)
        }
      }
    )
  })
}

const getAll = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM agents', (err, result, field) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = {
  getAll,
  insert
}
