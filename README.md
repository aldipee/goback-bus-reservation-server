<h1 align="center">ExpressJS - Simple Bus Reservations RESTfull API</h1>



Free bird is a simple Bus reservations application specially for backend only. Built with NodeJs using the ExpressJs Framework.
Express.js is a web application framework for Node.js. [More about Express](https://en.wikipedia.org/wiki/Express.js)

## Built With
[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.10.16-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements
1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app ?
1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name travel_db, and Import file [travel.sql](travel.sql) to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:3000/)
8. You can see all the end point [here](#end-point)

## Set up .env file
Open .env file on your favorite code editor, and copy paste this code below :
```
APP_PORT = 5001 //Your Port
APP_HOST = localhost // Your App Host
AUTH_KEY= bingodingosingoxingotongo94848484 // Key for JWT
PUBLIC_PATH = files/ 
PUBLIC_URL = /public/
DB_HOST= localhost // Database host
DB_DATABASE=travel // Database name
DB_USER=root // database username
DB_PASS= 
NODE_ENV=development node server.js
```

## End Point
**1. GET**

* `/routes`(Get  All routes) [Admin & Agent Only]



* `/schedules?sortBy=time&origin=JKT&destination=SMG&sort=0&date=2020-03-24`



* `/reservations/schedules?route=9` (Get All Reservations by route)



* `/auth/verify?code=5476ad74-eda8-4633-959d-a4fa7e082c94&action=27`



* `/schedules/price` (Get All price based related agent)



* `/bus` (Get All buses info on related agent)



* `/reservations/all-passengers` (Get all passengers on related agent)

**2. POST**

* `/schedules` (Agent)
    * ``` { "time": "07:00:00", "routeId": 2, "busId": 4 , date : '2020-03-24'} ```
* date [default = Today]



* `/bus` (Agent)
    
    * ``` { "busName": "Super JET Bus 3", totalSeat : 10 } ```
    
    
    
* `/routes` (Admin Only & Not Tested)
    
    * `{"origin" : "Semarang", "originCode" : "SMG", "destination" : "Jakarta", "destinationCode" : "JKT", "distance" : "588"}`
    
    
    
* `/agents` (Add new agents [Admin])
    
    * `{"userId" : "5",  "agentName" : "PT. Travel Sejati"}`
    
    
    
* `/agents/check-in` (User Check in By Booking Code [Agents])
    
    * `{"bookingCOde ": "387CA1FD"}`
    
    
    
* `/reservations/purchase`
    
    * `{"userIdNumber" : "1707031406010002", "userIdType" : "KTP", "seatNumber" : "4", "scheduleId" : "30"}`
    
    
    
* `/auth/register`
    
    * `{"username" : "abidaniela", "password" : "lala", "email" : "daniel3444@gmail.com"}`
    
    
    
* `/auth/login`
    
    * `{"username" : "abidaniela", "password" : "lala"}`
    
    
    
* `/users/profile`
    
    * `{"avatar" : "your-beautiful-pic.jpg", "fullName" : "Abi Daniela Trisdayanti", "bod" :  "2000-04-24",  "gender" :  "1", "phoneNumber" : "081367946763", "address" : "Jl. Suka Suka 4"}`
    
    
    
* `/schedules/price`
    
    * `{routeId : 4, price : 70000}`
    
    

**3. PATCH**



* `/routes/:id` (Update routes by id)
  
   * `{"origin" : "Semarang", "originCode" : "SMG", "destination" : "Jakarta", "destinationCode" : "JKT", "distance" : "900"}`
   
   
* `/users/:id` (Update users credentials by id)
  
  * ``` { username : "binggo", password : "nopasswordbos", email : "emailusers@gmail.com"}``` 
  
  
* `/schedules/price/:id`
  
  * ``` { price : 70000}```
  
  
  
* `/bus/:id`
   
   * `{busName : "Super Kencana Jet-Bus", totalSeat : 20}`
   
   

**4. DELETE**

* `/users/:id` (Delete users by id)

  
