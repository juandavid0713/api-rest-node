const express = require('express');
const Joi = require('joi');
const Usuario = require("../models/usuario_model");

const ruta = express.Router();

//VALIDAR BODY CON JOI PARA CONTROLAR DATOS
const schema = Joi.object({
  email: Joi.string().email().required(),
  nombre: Joi.string().min(4).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')),
});

//RUTA GET
ruta.get('/:estado', (req, res) => {
  let listadoUsuarios = listarUsuarios(req.params.estado);
  listadoUsuarios.then(users => {
    res.json({ valor: users })
  }).catch(err => {
    res.status(400).json({
      error: err
    })
  })

});

//RUTA POST
ruta.post('/', (req, res) => {
  const { error, value } = schema.validate({
    nombre: req.body.nombre,
    email: req.body.email,
    password: req.body.password
  });
  if (!error) {
    let crearUser = crearUsuario(req.body);
    crearUser.then(user => {
      res.json({ valor: user });
    }).catch(err => {
      res.status(400).json({ error: err });
    })
  } else {
    res.status(400).json({
      error: error
    })
  }
})

//RUTA PUT
ruta.put('/:email', function (req, res) {
  let actualizarUser = actualizarUsuario(req.params.email, req.body);

  actualizarUser.then(valor => {
    res.json({ valor: valor });
  }).catch(err => {
    res.status(400).json({ error: err });
  })
});

//MÉTODO PARA LISTAR UN USUARIO SEGÚN SU ESTADO
async function listarUsuarios(query) {
  let estado = { estado: query };
  let usuarios = await Usuario.find(estado, null).exec();
  return usuarios;
}

//MÉTODO PARA CREAR UN USUARIO EN LA BBDD
async function crearUsuario(body) {
  let usuario = new Usuario({
    email: body.email,
    nombre: body.nombre,
    password: body.password
  });
  return await usuario.save();
}

//MÉTODO PARA ACTUALIZAR UN USUARIO EN LA BBDD
async function actualizarUsuario(correo, body) {
  let email = { email: correo };
  let usuario = await Usuario.findOneAndUpdate(email, {
    $set: {
      nombre: body.nombre,
      password: body.password
    }
  }, { new: true });
  return usuario;
}

module.exports = ruta;