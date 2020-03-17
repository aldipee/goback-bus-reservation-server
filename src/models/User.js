const db = require('../utils/db')

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
 * @param {string} username Data username from Client
 * @param {string} password Data password from Client
 * @param {string} email Data email from Client
 * @param {number} role Type of Role from the place where this function being called
 */

const createNewUser = (username, password, email, role = 3) => {
  return new Promise((resolve, reject) => {
    // Insert into tabel 'users
    db.query(
      `INSERT INTO users ('username','passsword','email','role_id') VALUES('${username}', '${password}', '${email}', '${role}')`,
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

module.exports = {
  getAllUsersData,
  createNewUser
}
