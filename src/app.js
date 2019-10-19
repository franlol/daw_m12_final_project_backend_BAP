// Node Modules
const express = require('express');

// Settings
const app = express();

// Router
const router = express.Router();
router.get('/', (req, res) => {
  res.send('index')
})

// Middelware
app.use(router);

// Middlewares errores

module.exports = app;
