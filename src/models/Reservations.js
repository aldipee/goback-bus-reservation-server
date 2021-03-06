const db = require('../utils/db')
/**
 * This is for get price by on idSchedule
 * This function is being before user create reservations on Reservation controller
 * @param {number} idSchedule
 */
const getPriceByIdSchedule = (idSchedule) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT price.price FROM price JOIN schedules ON price.route_id  = schedules.route_id 
    AND price.agent_id = schedules.agent_id WHERE schedules.id = ${idSchedule}`
    db.query(query, (err, results) => {
      if (err) {
        reject(err)
      } else {
        results[0].price ? resolve(results[0].price) : resolve(0)
      }
    })
  })
}

/**
 * Create User's Reservation
 * @param {*} userId  User ID
 * @param {*} userIdNumber User ID NUMBER
 * @param {*} userIdType Type of Id Number
 * @param {*} seatNumber Seat Number
 * @param {*} scheduleId Schedule Id
 * @param {number} price
 */

const insert = (userId, userIdNumber, userIdType, seatNumber, scheduleId, price, bookingCode) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO reservations (user_id, user_id_number, user_id_type, seat_number, schedule_id, total_price, booking_code) 
      VALUES ('${userId}','${userIdNumber}','${userIdType}','${seatNumber}','${scheduleId}', '${price}', '${bookingCode}')`,
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
 * @return {array} of avaiable seats
 */
const getSeats = (idSchedule, route) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT reservations.id, buses.total_seat, schedules.route_id,reservations.seat_number FROM 
    reservations JOIN schedules ON reservations.schedule_id = schedules.id 
    JOIN buses ON buses.id = schedules.bus_id JOIN routes ON routes.id = schedules.route_id WHERE
    schedules.id = ${idSchedule} AND
    ${
      route.idRoute
        ? `schedules.route_id = ${route.idRoute}`
        : `routes.origin_code = '${route.originCode}' 
    AND routes.destination_code = '${route.destinationCode}`
    }'`
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
          const seatsAvailable = [...Array.from({ length: results[0].total_seat }, (v, k) => k + 1)].filter(
            (seat) => !seatsBooked.includes(seat)
          )

          resolve({ seatsBooked, seatsAvailable })
        } else {
          resolve(false)
        }
      }
    })
  })
}
/**
 * This is for get all reservation by route
 * normaly only super admin can view this
 *
 * @param {*} routeId
 */
const getReservationByRoute = async (routeId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT reservations.id, reservations.user_id_number, reservations.user_id_type, reservations.seat_number, reservations.check_in, users.username, users.email, schedules.time, routes.origin, routes.destination, routes.distance, buses.name, buses.total_seat, agents.name, price.price FROM reservations JOIN schedules ON reservations.schedule_id = schedules.id JOIN users ON users.id = reservations.user_id JOIN buses ON buses.id = schedules.bus_id JOIN routes ON routes.id = schedules.route_id JOIN agents ON schedules.agent_id = agents.id JOIN price ON price.route_id = schedules.route_id AND price.agent_id = agents.id WHERE schedules.route_id = ${routeId}`
    db.query(query, (err, results, field) => {
      if (err) {
        reject(err)
      } else {
        results.length ? resolve(results) : resolve(false)
      }
    })
  })
}

/**
 * This ione is being called nowhere
 * And this is for user's history
 * @param {*} userId
 */
const getUserReservation = (userId, checkIn, conditions) => {
  //   const query = `SELECT * FROM reservations JOIN schedules ON reservations.schedule_id = schedules.id JOIN users ON users.id = reservations.user_id JOIN buses ON buses.id = schedules.bus_id JOIN routes ON routes.id = schedules.route_id JOIN agents ON agents.id = schedules.agent_id WHERE reservations.user_id = 14`
  return new Promise((resolve, reject) => {
    let { sort, limit, page } = conditions
    console.log(conditions)
    sort = sort || { key: 'fullName', value: 1 }
    const query2 = `SELECT  reservations.user_id as booked_by_userid, reservations.id as reservation_id,
  reservations.booking_code,
    userdetails.fullName as booked_by_name, schedules.time as schedule_time, schedules.date as schedule_date, reservations.schedule_id, reservations.user_id_number as passenger_id , 
  reservations.user_id_type as passenger_id_type, reservations.seat_number, reservations.check_in, routes.origin, routes.origin_code, 
  routes.destination, routes.destination_code, routes.id as route_id, routes.distance, buses.name as bus_name, buses.total_seat, 
  agents.name as travel_name, schedules.agent_id as travel_id, price.price as totalPrice FROM reservations JOIN schedules ON reservations.schedule_id = schedules.id 
  JOIN routes ON routes.id = schedules.route_id JOIN  buses ON schedules.bus_id = buses.id JOIN userdetails ON reservations.user_id = userdetails.userId
  JOIN agents ON schedules.agent_id = schedules.agent_id  JOIN price ON price.route_id = schedules.route_id 
  AND price.agent_id = agents.id
  WHERE reservations.user_id = ${userId} AND agents.id = schedules.agent_id AND reservations.check_in = ${checkIn}
  ORDER BY
  ${sort.key} ${sort.value ? 'ASC' : 'DESC'} LIMIT ${limit} OFFSET ${(page - 1) * limit}
  
  `
    console.log(query2)
    db.query(query2, (err, result, field) => {
      if (err) {
        reject(err)
      } else {
        result.length ? resolve(result) : resolve(false)
      }
    })
  })
}

/**
 * This function for get all Reservation details
 * And being called on Reservation Controller after the reservations inserted
 *
 * @param {*} idReservation
 * @returns {object} of reservations details
 */
const reservationSummary = (idReservation) => {
  return new Promise((resolve, reject) => {
    if (idReservation) {
      const query = `SELECT reservations.user_id as booked_by_userid, reservations.booking_code, userdetails.fullName as booked_by_name, schedules.time as schedule_time, reservations.schedule_id, reservations.user_id_number as passenger_id , 
    reservations.user_id_type as passenger_id_type, reservations.seat_number, reservations.check_in, routes.origin, routes.origin_code, 
    routes.destination, routes.destination_code, routes.id as route_id, routes.distance, buses.name as bus_name, buses.total_seat, 
    agents.name as travel_name, schedules.agent_id as travel_id, price.price as totalPrice FROM reservations JOIN schedules ON reservations.schedule_id = schedules.id 
    JOIN routes ON routes.id = schedules.route_id JOIN  buses ON schedules.bus_id = buses.id JOIN userdetails ON reservations.user_id = userdetails.userId
    JOIN agents ON schedules.agent_id = schedules.agent_id  JOIN price ON price.route_id = schedules.route_id AND price.agent_id = agents.id
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

const getAllReservationsByAgent = (agentId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT reservations.id as id_reservation, reservations.user_id_number as passenger_id_number, 
    reservations.user_id_type as passenger_id_type, reservations.seat_number, reservations.booking_code, reservations.check_in, 
    schedules.id as schedule_id, schedules.time, schedules.date, schedules.route_id, schedules.bus_id,  
    userdetails.fullName, userdetails.gender FROM reservations JOIN schedules 
    ON schedules.id = reservations.schedule_id JOIN routes ON schedules.route_id = routes.id JOIN userdetails 
    ON userdetails.userId = reservations.user_id WHERE schedules.agent_id = '${agentId}'`
    db.query(query, (err, results, field) => {
      if (err) {
        reject(err)
      } else {
        results.length ? resolve(results) : resolve(false)
      }
    })
  })
}

const getAllReservations = (conditions) => {
  const { search, sort, page, perPage } = conditions
  console.log('from model', conditions)
  return new Promise((resolve, reject) => {
    const query = `SELECT reservations.id as id_reservation, reservations.check_in, 
    schedules.id as schedule_id, schedules.time, schedules.date, schedules.route_id, schedules.bus_id,  
    userdetails.fullName, userdetails.gender, routes.destination, routes.origin
    FROM reservations JOIN schedules 
    ON schedules.id = reservations.schedule_id JOIN routes ON schedules.route_id = routes.id 
    JOIN userdetails 
    ON userdetails.userId = reservations.user_id WHERE ${search.key} LIKE '%${search.value}%' 
    ORDER BY ${sort.key} ${sort.value ? 'ASC' : 'DESC'}
    LIMIT ${perPage} OFFSET ${(page - 1) * perPage}
    `
    console.log(query)
    db.query(query, (err, results, field) => {
      if (err) {
        reject(err)
      } else {
        results.length ? resolve(results) : resolve(false)
      }
    })
  })
}

const getMyReservations = (conditions, agentId) => {
  const { search, sort, page, perPage } = conditions
  console.log('from model', conditions)
  return new Promise((resolve, reject) => {
    const query = `SELECT reservations.id as id_reservation, reservations.check_in, 
      schedules.id as schedule_id, schedules.time, schedules.date, schedules.route_id, schedules.bus_id,  
      userdetails.fullName, userdetails.gender, routes.destination, routes.origin
      FROM reservations JOIN schedules 
      ON schedules.id = reservations.schedule_id JOIN routes ON schedules.route_id = routes.id 
      JOIN userdetails 
      ON userdetails.userId = reservations.user_id WHERE ${search.key} LIKE '%${
      search.value
    }%' AND schedules.agent_id = '${agentId}'
      ORDER BY ${sort.key} ${parseInt(sort.value) ? 'ASC' : 'DESC'}
      LIMIT ${perPage} OFFSET ${(page - 1) * perPage}
      `
    console.log(query)
    db.query(query, (err, results, field) => {
      if (err) {
        reject(err)
      } else {
        results.length ? resolve(results) : resolve(false)
      }
    })
  })
}

const getTotalAllPassenger = (conditions, agentId) => {
  const { search } = conditions
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as total FROM reservations`
    console.log(query)
    db.query(query, (err, results, field) => {
      if (err) {
        reject(err)
      } else {
        results.length ? resolve(results[0]) : resolve(false)
      }
    })
  })
}

const getReservationsById = (reservationId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT reservations.id as id_reservation, reservations.user_id_number as passenger_id_number, 
    reservations.user_id_type as passenger_id_type, reservations.seat_number, reservations.booking_code, reservations.check_in, 
    schedules.id as schedule_id, schedules.time, schedules.date, schedules.route_id, schedules.bus_id,  
    userdetails.fullName, userdetails.gender, routes.destination, routes.origin FROM reservations JOIN schedules 
    ON schedules.id = reservations.schedule_id JOIN routes ON schedules.route_id = routes.id JOIN userdetails 
    ON userdetails.userId = reservations.user_id WHERE reservations.id = '${reservationId}'`
    db.query(query, (err, results, field) => {
      if (err) {
        reject(err)
      } else {
        results.length ? resolve(results[0]) : resolve(false)
      }
    })
  })
}

const getTotalReservations = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as total FROM reservations`
    db.query(query, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data[0].total)
      }
    })
  })
}

module.exports = {
  insert,
  getUserReservation,
  getSeats,
  getReservationByRoute,
  getPriceByIdSchedule,
  reservationSummary,
  getTotalAllPassenger,
  getAllReservationsByAgent,
  getAllReservations,
  getReservationsById,
  getMyReservations,
  getTotalReservations
}
