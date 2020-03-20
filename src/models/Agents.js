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

const getDataAgent = userId => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      reject(new Error('Unvalid parameter in getDataAgent'))
    } else {
      db.query(
        `SELECT id,name,created_by,create_at FROM agents WHERE user_id=${userId}`,
        (err, result, field) => {
          if (err) {
            reject(err)
          } else {
            result ? resolve(result[0]) : result(false)
          }
        }
      )
    }
  })
}

module.exports = {
  getAll,
  getDataAgent,
  insert
}
