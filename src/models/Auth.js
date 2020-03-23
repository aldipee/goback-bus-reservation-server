const db = require('../utils/db')

/**
 * Verify User w/ userId and Random code
 * @param {Number} userId User Identifier
 * @param {String} code UUID Code that has length 37 Charachters
 * @returns {Boolean} If Successfully will return true, otherwise false
 */
const verifyUser = (userId, code) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users SET is_verified = 1, verified_code = '' WHERE verified_code = '${code}' AND id ='${userId}'`
    db.query(query, (err, result) => {
      if (err) {
        reject(err)
      } else {
        result.changedRows ? resolve(true) : resolve(false)
      }
    })
  })
}

module.exports = {
  verifyUser
}
