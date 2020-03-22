const db = require('../src/utils/db')

//TABLE AGENTS
db.query(
  `CREATE TABLE agents (
    'id' int(11) NOT NULL,
    'name varchar(50) NOT NULL,
    'user_id' int(11) DEFAULT NULL,
    'created_by' int(11) DEFAULT NULL,
    'create_at' datetime DEFAULT current_timestamp(),
    'update_at' datetime DEFAULT NULL ON UPDATE current_timestamp()
  )`,
  () => {
    db.query(`INSERT INTO 'agents' ('id', 'name', 'user_id', 'created_by', 'create_at', 'update_at') VALUES
    (15, 'PT. Budi Travel Utama Putra Sejahtera', 12, 1, '2020-03-19 10:12:03', '2020-03-20 22:18:23'),
    (16, 'PT. Sejahtera Transport Mulia', 13, 1, '2020-03-19 17:12:38', NULL),
    (17, 'CV. Mulya Transport Permata', 15, 1, '2020-03-20 22:17:31', NULL)`)
  }
)

//TABLE BUS
db.query(
  `CREATE TABLE 'buses' (
        'id' int(11) NOT NULL,
        'name' varchar(100) NOT NULL,
        'total_seat' int(11) NOT NULL,
        'agent_id' int(11) DEFAULT NULL,
        'created_by' int(11) DEFAULT NULL,
        'create_at' datetime DEFAULT current_timestamp(),
        'update_at' datetime DEFAULT NULL ON UPDATE current_timestamp()
      )`,
  () => {
    db.query(`INSERT INTO buses (id, name, total_seat, agent_id, created_by, create_at, update_at) VALUES
    (4, 'Bus Nusantara', 100, 15, 12, '2020-03-19 13:27:09', NULL),
    (5, 'Bus Nusantara 2', 100, 15, 12, '2020-03-19 13:27:46', NULL),
    (8, 'PO. Ramayana', 96, 15, 12, '2020-03-19 17:10:33', NULL),
    (9, 'PO. Haryanto E49', 200, 16, 13, '2020-03-19 17:13:48', NULL),
    (10, 'Sriwijaya', 80, 16, 13, '2020-03-19 20:42:23', NULL),
    (11, 'Kencana Bens ', 138, 15, 12, '2020-03-20 22:24:26', NULL),
    (12, 'Putra Speed Bus', 99, 15, 12, '2020-03-20 22:24:58', NULL),
    (13, 'Sayonara Jet Bus', 99, 15, 12, '2020-03-20 22:25:20', NULL),
    (14, 'Private Jet Bus', 10, 15, 12, '2020-03-20 22:25:35', NULL),
    (15, 'Private Jet Bus #2', 15, 15, 12, '2020-03-20 22:25:44', NULL),
    (16, 'Roll Super Bus', 87, 16, 13, '2020-03-20 22:28:45', NULL),
    (17, 'Big Brother Bus', 36, 16, 13, '2020-03-20 22:29:10', NULL),
    (18, 'Fast T Kencana Bus', 50, 16, 13, '2020-03-20 22:29:33', NULL),
    (19, 'VIP Bus', 5, 16, 13, '2020-03-20 22:29:46', NULL),
    (20, 'SUPER BUS FAST  A-1', 7, 17, 15, '2020-03-20 22:37:02', '2020-03-20 22:38:12'),
    (21, 'SUPER BUS FAST  A-2', 7, 17, 15, '2020-03-20 22:37:21', '2020-03-20 22:38:07'),
    (22, 'SUPER BUS FAST  A-3', 7, 17, 15, '2020-03-20 22:37:31', NULL),
    (23, 'SUPER BUS FAST  A-4', 7, 17, 15, '2020-03-20 22:37:35', NULL),
    (24, 'SUPER BUS COMFORT A-5', 10, 17, 15, '2020-03-20 22:37:39', '2020-03-23 02:42:02')`)
  }
)

//TABLE PRICE
db.query(
  `CREATE TABLE price (
    id int(11) NOT NULL,
    price int(11) NOT NULL,
    route_id int(11) DEFAULT NULL,
    agent_id int(11) DEFAULT NULL
  )`,
  () => {
    db.query(`INSERT INTO price (id, price, route_id, agent_id) VALUES
    (11, 150000, 1, 17),
    (12, 150000, 1, 15),
    (13, 200000, 1, 16),
    (14, 100000, 2, 15),
    (15, 100000, 2, 16),
    (16, 100000, 2, 17),
    (17, 390000, 3, 15),
    (18, 350000, 3, 16),
    (19, 350000, 3, 17),
    (20, 74000, 4, 15),
    (21, 79000, 4, 16),
    (22, 80000, 4, 17),
    (23, 120000, 5, 15),
    (24, 120000, 5, 16),
    (25, 120000, 5, 17),
    (26, 15000, 6, 15),
    (27, 17000, 6, 16),
    (28, 17000, 6, 17),
    (29, 290000, 7, 15),
    (30, 290000, 7, 17),
    (31, 290000, 7, 16),
    (32, 45000, 9, 15),
    (33, 49000, 9, 16),
    (34, 60000, 9, 17)`)
  }
)

//TABLE PRICE
db.query(
  `CREATE TABLE price (
      id int(11) NOT NULL,
      price int(11) NOT NULL,
      route_id int(11) DEFAULT NULL,
      agent_id int(11) DEFAULT NULL
    )`,
  () => {
    db.query(`INSERT INTO price (id, price, route_id, agent_id) VALUES
      (11, 150000, 1, 17),
      (12, 150000, 1, 15),
      (13, 200000, 1, 16),
      (14, 100000, 2, 15),
      (15, 100000, 2, 16),
      (16, 100000, 2, 17),
      (17, 390000, 3, 15),
      (18, 350000, 3, 16),
      (19, 350000, 3, 17),
      (20, 74000, 4, 15),
      (21, 79000, 4, 16),
      (22, 80000, 4, 17),
      (23, 120000, 5, 15),
      (24, 120000, 5, 16),
      (25, 120000, 5, 17),
      (26, 15000, 6, 15),
      (27, 17000, 6, 16),
      (28, 17000, 6, 17),
      (29, 290000, 7, 15),
      (30, 290000, 7, 17),
      (31, 290000, 7, 16),
      (32, 45000, 9, 15),
      (33, 49000, 9, 16),
      (34, 60000, 9, 17)`)
  }
)
