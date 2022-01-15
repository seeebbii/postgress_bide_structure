const { Pool } = require('pg')
const pool = new Pool({
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: 5432
})

module.exports = pool;