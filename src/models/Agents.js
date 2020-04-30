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

/**
 * Get All agents
 * @returns {Array of Object} data agents
 */
const getAll = () => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT agents.name as agent_name, agents.id as agent_id, users.username, users.email, users.id as user_id  FROM agents JOIN users ON agents.user_id = users.id',
      (err, result, field) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
    )
  })
}

/**
 * Single data agents by user id
 * @param {number} userId as identifier for selecting data
 * @returns {Array of Object} details agent data
 */
const getDataAgent = (userId) => {
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

/**
 * Get Reservations detail(Passenger) by Booking Code
 * @param {String} bookingCode
 * @returns {Array of Object} Passenger & boarding data
 */
const reservationsDetailsByBookingCode = (bookingCode) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT reservations.id as idReservation, reservations.booking_code, 
    reservations.user_id_number, reservations.user_id_type, reservations.total_price, 
    reservations.create_at as booked_time, buses.name, reservations.seat_number, schedules.time, 
    schedules.date, userdetails.fullName, userdetails.gender, userdetails.phoneNumber, routes.destination, 
    routes.destination_code, routes.origin, routes.origin_code FROM reservations 
    JOIN schedules ON reservations.schedule_id = schedules.id JOIN userdetails 
    ON reservations.user_id = userdetails.userId JOIN routes ON routes.id = schedules.route_id JOIN buses 
    ON buses.id = schedules.bus_id WHERE reservations.booking_code = '${bookingCode}'`
    db.query(query, (err, result) => {
      if (err) {
        reject(err)
      } else {
        result.length ? resolve(result[0]) : resolve(false)
      }
    })
  })
}

/**
 * Insert Booking Code at Agent's Counter
 * @param {String} bookingCode
 * @returns {Boolean} If Success will return true, otherwise false
 */
const passengerCheckIn = (bookingCode) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE reservations SET check_in = 1 WHERE booking_code = '${bookingCode}'`
    db.query(query, (err, result) => {
      if (err) {
        reject(err)
      } else {
        result.changedRows ? resolve(true) : resolve(false)
      }
    })
  })
}

const agentDetailById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM agents WHERE agents.id = ${id}`
    db.query(query, (err, result) => {
      if (err) {
        reject(err)
      } else {
        result.length ? resolve(result) : reject(new Error('No Data found'))
      }
    })
  })
}

module.exports = {
  getAll,
  getDataAgent,
  insert,
  passengerCheckIn,
  reservationsDetailsByBookingCode,
  agentDetailById
}
