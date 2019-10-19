// Node Modules
const express = require('express');

// Own modules
const routes = require('./routes');

// Settings
const app = express();

// Middlewares
app.use(express.json());
app.use(routes);

module.exports = app;
