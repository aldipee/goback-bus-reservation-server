const db = require('../utils/db')
const bcrypt = require('bcryptjs')
const uuid = require('uuid').v4

/**
 *Get All data users from database
 * @returns {Array of Object} All users from database
 */

const getAllUsersData = (conditions) => {
  return new Promise((resolve, reject) => {
    // Select all from table 'users'
    const { search, sort, sortBy, page, perPage } = conditions
    // const query2 = `SELECT users.id as id, users.username, users.email, userdetails.fullName, userdetails.gender,
    // userdetails.bod, userdetails.balance, userdetails.phoneNumber, userdetails.avatar
    // FROM users JOIN userdetails WHERE users.id = userdetails.userId AND  userdetails.fullName LIKE
    // 'si%'`
    const query = `SELECT users.id as id, users.createAt, users.username, users.email, userdetails.fullName, userdetails.gender,
    userdetails.bod, userdetails.balance, userdetails.phoneNumber, userdetails.avatar
    FROM users JOIN userdetails WHERE users.id = userdetails.userId  AND  ${search.key} LIKE 
    '%${search.value}%' ORDER BY ${sortBy} ${sort ? 'ASC' : 'DESC'}
    LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`
    console.log(query)
    db.query(query, (err, result) => {
      if (!err) {
        resolve({ status: true, data: result })
      } else {
        reject(err)
      }
    })
  })
}

const totalUsers = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as total FROM users`
    db.query(query, (err, result) => {
      if (!err) {
        resolve({ status: true, data: result })
      } else {
        reject(err)
      }
    })
  })
}

/**
 * Get User Profile Detail based on Primary user ID
 * @param {numer} userId
 * @returns {object} of Profile data
 */
const getUserDetails = (userId) => {
  return new Promise((resolve, reject) => {
    if (userId) {
      const query = `SELECT id, fullName, balance, bod, gender, phoneNumber, fullAddress, avatar
       FROM userdetails WHERE userId = ${userId}`
      db.query(query, (err, result) => {
        if (err) {
          reject(err)
        } else {
          result.length ? resolve(result[0]) : reject(new Error('Profile not found'))
        }
      })
    } else {
      reject(new Error('Invald parameter'))
    }
  })
}

/**
 * Get user's data from username
 * @todo Modify the function to accept userId too
 * @param {string} username
 * @returns {object} data based on username
 */
const getUserData = (username) => {
  if (username) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE username='${username}'`, (err, result, fields) => {
        if (!err) {
          result[0] ? resolve(result[0]) : resolve(false)
        } else {
          reject(err)
        }
      })
    })
  } else {
    return 'Required username Parameter in getUserData'
  }
}

const getUserDataById = (userId) => {
  if (userId) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT verified_code FROM users WHERE id='${userId}'`, (err, result, fields) => {
        if (!err) {
          result[0] ? resolve(result[0]) : resolve(false)
        } else {
          reject(err)
        }
      })
    })
  } else {
    return 'Required userId Parameter in getUserData'
  }
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
      `INSERT INTO users (username,password,email,role_id, verified_code) VALUES('${username}', '${encryptPassword}', '${email}', '${role}','${uuid()}')`,
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

const isUsernameExist = (username) => {
  console.log(username)
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

const remove = (userId) => {
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
 * @todo Add advance function to update particular field only
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

/**
 * Insert user data
 * @param {number} userId  from user sessions
 * @param {string} fullName
 * @param {date} bod Date format (YYYY-MM-DD)
 * @param {number} gender (0 for male, and 1 for female)
 * @param {string} phoneNumber Default null
 * @param {string} fullAddress Default
 * @param {number} balance
 */
const insertUserDetails = (userId, fullName, bod, gender, phoneNumber, fullAddress, balance = 0, picture) => {
  return new Promise((resolve, reject) => {
    if (userId) {
      // Convert to gender to string
      gender = parseInt(gender) ? 'female' : 'male'

      const query = `INSERT INTO userdetails (userId, fullName, bod, gender, phoneNumber, fullAddress, balance, avatar) 
      VALUES ('${userId}','${fullName}','${bod}','${gender}','${phoneNumber}','${fullAddress}','${balance}', '${picture}')
      `
      db.query(query, (err, results, field) => {
        if (!err) {
          results.insertId ? resolve(true) : resolve(false)
        } else {
          reject(err)
        }
      })
    } else {
      reject(new Error('Parameter incorrect'))
    }
  })
}

const isProfileCompleted = (userId) => {
  return new Promise((resolve, reject) => {
    if (userId) {
      const query = `SELECT COUNT(*) AS total FROM userdetails WHERE userId='${userId}'`
      db.query(query, (err, results) => {
        if (!err) {
          results[0].total ? resolve(true) : resolve(false)
        } else {
          reject(err)
        }
      })
    } else {
      reject(new Error('Incorrect parameter for isProfileCompleted method'))
    }
  })
}

const getAllProfileById = (userId) => {
  return new Promise((resolve, reject) => {
    if (userId) {
      const query = `SELECT * FROM users JOIN userdetails ON userdetails.user_id = users.id JOIN `
      db.query(query, (err, results) => {
        if (!err) {
          results[0].total ? resolve(true) : resolve(false)
        } else {
          reject(err)
        }
      })
    } else {
      reject(new Error('Incorrect parameter for isProfileCompleted method'))
    }
  })
}

// insertUserDetails(1, 'Aldi Pranata', '2000-06-14', 'male', '6282185142048', 'Jl. Suka sari 3 No.53, Kota Bogor', 90000)
module.exports = {
  getAllUsersData,
  getUserData,
  insert,
  remove,
  update,
  isUsernameExist,
  insertUserDetails,
  isProfileCompleted,
  getUserDetails,
  getUserDataById,
  totalUsers
}
