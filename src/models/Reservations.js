const db = require('../utils/db')

/**
 * Create User's Reservation
 * @param {*} userId  User ID
 * @param {*} userIdNumber User ID NUMBER
 * @param {*} userIdType Type of Id Number
 * @param {*} seatNumber Seat Number
 * @param {*} scheduleId Schedule Id
 */

const insert = (userId, userIdNumber, userIdType, seatNumber, scheduleId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO reservations (user_id, user_id_number, user_id_type, seat_number, schedule_id) VALUES ('${userId}','${userIdNumber}','${userIdType}','${seatNumber}','${scheduleId}')`,
      (err, result, field) => {
        if (err) {
          reject(err)
        } else {
          result ? resolve(result) : resolve(false)
        }
      }
    )
  })
}
/**
 * Get info of seats on bus based on Schedule id and Route id
 * @param {number} idSchedule
 * @param {number} idRoute
 */
const getSeats = (idSchedule, route) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT reservations.id, buses.total_seat, schedules.route_id,reservations.seat_number FROM 
    reservations JOIN schedules ON reservations.schedule_id = schedules.id 
    JOIN buses ON buses.id = schedules.bus_id JOIN routes ON routes.id = schedules.route_id WHERE
    schedules.id = ${idSchedule} AND
    ${route.idRoute ? `schedules.route_id = ${route.idRoute}` : `routes.origin_code = '${route.originCode}' 
    AND routes.destination_code = '${route.destinationCode}`}'`
    db.query(query, (err, results, field) => {
      if (err) {
        console.log('getSeats Rreservations', err)
        reject(err)
      } else {
        if (results.length) {
          const seatsBooked = []
          results.map((data, index) => {
            seatsBooked.push(data.seat_number)
          })
          const seatsAvailable = [
            ...Array.from({ length: results[0].total_seat }, (v, k) => k + 1)
          ].filter(seat => !seatsBooked.includes(seat))

          resolve({ seatsBooked, seatsAvailable })
        } else {
          resolve(false)
        }
      }
    })
  })
}

const getReservationByRoute = async routeId => {
  return new Promise((resolve, reject) => {
    const query = `SELECT reservations.id, reservations.user_id_number, reservations.user_id_type, reservations.seat_number, reservations.cancel, users.username, users.email, schedules.time, routes.origin, routes.destination, routes.distance, buses.name, buses.total_seat, agents.name, price.price FROM reservations JOIN schedules ON reservations.schedule_id = schedules.id JOIN users ON users.id = reservations.user_id JOIN buses ON buses.id = schedules.bus_id JOIN routes ON routes.id = schedules.route_id JOIN agents ON schedules.agent_id = agents.id JOIN price ON price.route_id = schedules.route_id AND price.agent_id = agents.id WHERE schedules.route_id = ${routeId}`
    db.query(query, (err, results, field) => {
      if (err) {
        reject(err)
      } else {
        results.length ? resolve(results) : resolve(false)
      }
    })
  })
}

const getUserReservation = userId => {
  //   const query = `SELECT * FROM reservations JOIN schedules ON reservations.schedule_id = schedules.id JOIN users ON users.id = reservations.user_id JOIN buses ON buses.id = schedules.bus_id JOIN routes ON routes.id = schedules.route_id JOIN agents ON agents.id = schedules.agent_id WHERE reservations.user_id = 14`
  const query2 = `SELECT reservations.id, reservations.user_id_number, reservations.user_id_type, reservations.seat_number, reservations.cancel, users.username, users.email, schedules.time, routes.origin, routes.destination, routes.distance, buses.name, buses.total_seat, agents.name, price.price FROM reservations JOIN schedules ON reservations.schedule_id = schedules.id JOIN users ON users.id = reservations.user_id JOIN buses ON buses.id = schedules.bus_id JOIN routes ON routes.id = schedules.route_id JOIN agents ON schedules.agent_id = agents.id JOIN price ON price.route_id = schedules.route_id AND price.agent_id = agents.id WHERE reservations.user_id = ${userId}`
  db.query(query2, (err, result, field) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
    }
  })
}


const reservationSummary = (idReservation) => {
  return new Promise((resolve, reject) => {
    if (idReservation) {
      const query = `SELECT reservations.user_id, schedules.time, reservations.schedule_id, reservations.user_id_number , 
    reservations.user_id_type, reservations.seat_number, reservations.cancel, routes.origin, routes.origin_code, 
    routes.destination, routes.destination_code, routes.id, routes.distance, buses.name, buses.total_seat, 
    agents.name, schedules.agent_id  FROM reservations JOIN schedules ON reservations.schedule_id = schedules.id 
    JOIN routes ON routes.id = schedules.route_id JOIN  buses ON schedules.bus_id = buses.id 
    JOIN agents ON schedules.agent_id = schedules.agent_id  
    WHERE reservations.id = ${idReservation} AND agents.id = schedules.agent_id`
      db.query(query, (err, results, field) => {
        if (!err) {
          results.length ? resolve(results[0]) : resolve({ message: 'Data not found' })
        } else {
          console.error(err)
        }
      })
    } else {
      reject(new Error('reservationSummary required paramater'))
    }
  })
}


// getReservationByRoute(9)
module.exports = {
  insert,
  getUserReservation,
  getSeats,
  getReservationByRoute,
  reservationSummary
}
