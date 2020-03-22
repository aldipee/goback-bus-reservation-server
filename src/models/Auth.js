const db = require('../utils/db')

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
