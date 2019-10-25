// Node Modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Own modules
const routes = require('./routes');

// Settings
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
dotenv.config();
app.use(routes);

// TODO extract 4xx and 5xx middlewares
app.use((req, res) => {
  res.status(404);
  res.json({
    message: 'URL Not found'
  });
});

app.use((err, req, res) => {
  res.status(500);
  res.json({
    message: 'Server internal error'
  });
});

module.exports = app;
