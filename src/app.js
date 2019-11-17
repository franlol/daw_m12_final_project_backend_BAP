// Node Modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');

// Own modules
const routes = require('./routes');

// Settings
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(session({ secret: 's3cr37', saveUninitialized: true, resave: true })); // TODO generate new key, and put in envs
// app.use(morgan('dev'));
dotenv.config({ path: __dirname + '/.env' });
app.use(routes);

// TODO extract 4xx and 5xx middlewares
app.use((req, res) => {
  res.status(404);
  res.send({
    message: 'URL Not found'
  });
});

app.use((err, req, res) => {
  res.status(500);
  res.json({
    code: 1,
    message: 'Server internal error'
  });
});

module.exports = app;
