const express = require('express');
const path = require('path');
require('dotenv').config();

// DB config
require('./database/config').dbConnection();

// App de express
const app = express();

// Lectura y paseo del body
app.use(express.json());

// Node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket.js');


// Path publico
const publicPath = path.resolve(__dirname, 'public');

// Mis rutas
app.use('/api/login', require('./routes/auth'));

app.use(express.static(publicPath));

server.listen(process.env.PORT, (err) =>{
    if(err) throw new Error(err);

    console.log(`Servidor corriendo en el puerto: ${process.env.PORT}`);
})