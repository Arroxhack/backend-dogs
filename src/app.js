const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); // ojo que no haga falta cambiar por estar deprecated
const morgan = require('morgan');
const routes = require('./routes/index.js');
const { application } = require('express');

require('./db.js'); 

const server = express(); // instancia de express a utilizar

server.name = 'API';

server.use(express.urlencoded({ extended: true, limit: '50mb' })); // cambie bodyParser por express porque esta deprecado
server.use(express.json({ limit: '50mb' })); // cambie bodyParser por express porque esta deprecado
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => { // todo esto es configuracion de cors
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from // En caso de algun problema cambiamos http://localhost:3000 por * // /* 'http://localhost:3000' */
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

server.use('/', routes); // El server va a usar en "/" las rutas traidas de './routes/index.js'


// Error catching endware. 
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

server.use('*', (req, res) => {
  // console.log(req.baseUrl)
  let notExistingUrl = req.baseUrl;
  console.log("notExistingUrl: ",  notExistingUrl);
  res.status(404).send(`${notExistingUrl} route does not exist`);
});

module.exports = server; // exporto la instancia de express
