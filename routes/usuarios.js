const express = require('express');
const Usuario = require("../models/usuario_model");

const ruta = express.Router();

ruta.get('/', (req, res) => {
  res.send('GET usuarios');
});

ruta.post('/', (req, res) => {
  let body = req.body;
  let crearUser = crearUsuario(body);
  crearUser.then(user => {
    res.json({ valor: user });
  }).catch(err => {
    res.status(400).json({ error: err });
  })

})


ruta.put('/:email', function(req, res) {
  let actualizarUser = actualizarUsuario(req.params.email, req.body);
  
  actualizarUser.then(valor => {
    //console.log(valor);
    res.json({ valor: valor });
  }).catch(err => {
    res.status(400).json({ error: err });
  })
});

async function crearUsuario(body) {
  let usuario = new Usuario({
    email: body.email,
    nombre: body.nombre,
    password: body.password
  });
  return await usuario.save();
}

async function actualizarUsuario(correo, body) {
  let email = {email:correo};
  let usuario = await Usuario.findOneAndUpdate(email, {
    $set: {
      nombre: body.nombre,
      password: body.password
    }
  }, { new: true });
  return usuario;
}


module.exports = ruta;