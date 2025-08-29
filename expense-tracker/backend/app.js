const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const app = express();

require('dotenv').config();

// Use default port 5000 if process.env.PORT is undefined
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)));

// Server function to start the server and connect to DB
const server = () => {
    db(); // Connect to the database
    app.listen(PORT, () => {
        console.log(`Server listening on port: ${PORT}`);
    });
};

server();
