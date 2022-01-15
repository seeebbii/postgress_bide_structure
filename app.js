//! MODULE IMPORTS
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT;

//! ROUTE IMPORTS
const studentRoutes = require('./routes/student_routes');

app.use(express.json({ limit: '1000mb' }))

app.use(cors(), (req, res, next) => {
    next()
})

app.use('/api/students', studentRoutes)

app.listen(port, () => console.log(`Server running at port: ${port}`))