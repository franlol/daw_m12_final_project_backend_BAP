// Node Modules
const express = require('express');

// Own modules
const routes = require('./routes');

// Settings
const app = express();

// Middlewares
app.use(express.json());
app.use(routes);

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
