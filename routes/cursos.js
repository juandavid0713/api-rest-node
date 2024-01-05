const express = require('express');

const ruta = express.Router();

ruta.get('/', (req, res) => {
  res.send('GET cursos');
});

module.exports = ruta;