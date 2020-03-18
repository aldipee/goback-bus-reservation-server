const db = require('../utils/db')
const bcrypt = require('bcryptjs')

/**
 *Get All data users from database
 * @returns {Array of Object} All users from database
 */

const getAllUsersData = () => {
  return new Promise((resolve, reject) => {
    // Select all from table 'users'
    db.query('SELECT * FROM users', (err, result, field) => {
      if (!err) {
        resolve({ status: true, data: result })
      } else {
        reject(err)
      }
    })
  })
}

/**
 * Insert new user to database
 * @todo Add Strict rules about username for accepts alphanumeric only
 * @param {string} username Data username from Client
 * @param {string} password Data password from Client
 * @param {string} email Data email from Client
 * @param {number} role Type of Role from the place where this function being called
 * @returns {Object} Use property affectedRows or insertId to confirmed that data has been created
 */

const insert = (username, password, email, role = 3) => {
  const encryptPassword = bcrypt.hashSync(password)
  return new Promise((resolve, reject) => {
    // Insert into tabel 'users
    db.query(
      `INSERT INTO users (username,password,email,role_id) VALUES('${username}', '${encryptPassword}', '${email}', '${role}')`,
      (err, results, fields) => {
        if (!err) {
          resolve({ success: true, data: results })
        } else {
          reject(err)
        }
      }
    )
  })
}

/**
 * Check Avaibiliity username in Database
 * @todo Add Parameter Valid Verification
 * @param {string} username Data username that we wanted to check
 * @return {Boolean} True for exist, else for does not exist
 */

const isUsernameExist = username => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT COUNT(*) AS total FROM users WHERE username='${username}'`, (err, results, field) => {
      if (!err) {
        results[0].total ? resolve(true) : resolve(false)
      } else {
        reject(err)
      }
    })
  })
}

/**
 * @todo Add Parameter Valid Verification
 * @param {*} userId
 */

const remove = userId => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM users WHERE id='${userId}'`, (err, result, field) => {
      if (!err) {
        result.affectedRows ? resolve(true) : resolve(false)
      } else {
        reject(err)
      }
    })
  })
}

/**
 * Update data users in database
 * @todo Add email Valid Verification
 * @todo Add Parameter Valid Checking
 * @todo Add Documentation
 */

const update = (userId, username, password, email) => {
  return new Promise((resolve, reject) => {
    const encryptPassword = bcrypt.hashSync(password)
    db.query(
      `UPDATE users SET username='${username}', password='${encryptPassword}', email='${email}' WHERE id='${userId}'`,
      (err, result, field) => {
        if (!err) {
          result.changedRows ? resolve(true) : resolve(false)
        } else {
          reject(err)
        }
      }
    )
  })
}

const read = userId => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM users WHERE id='${userId}'`, (err, result, fields) => {
      if (!err) {
        result[0] ? resolve({ success: true, data: result[0] }) : resolve({ success: false, data: { message: 'Data not found' } })
      } else {
        reject(err)
      }
    })
  })
}



module.exports = {
  getAllUsersData,
  insert,
  remove,
  update,
  read,
  isUsernameExist
}
