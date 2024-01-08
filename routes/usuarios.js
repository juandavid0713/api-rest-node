const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
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
    res.json(users)
  }).catch(err => {
    res.status(400).json({
      error: err
    })
  })

});

//RUTA POST
ruta.post('/', (req, res) => {
  let validar = Usuario.findOne({ email: req.body.email }).exec();
  validar.then(user => {
    if (user) {
      return res.status(400).json("Usuario ya existe en la BBDD");
    }
    else {
      const { error, value } = schema.validate({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password
      });
      if (!error) {
        let crearUser = crearUsuario(req.body);
        crearUser.then(user => {
          res.json({
            id: user._id,
            nombre: user.nombre,
            email: user.email,
            estado: user.estado
          });
        }).catch(err => {
          res.status(400).json({ error: err });
        })
      } else {
        res.status(400).json({
          error: error
        })
      }
    }
  }).catch(err => {
    res.json(err);
  });

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
  let usuarios = await Usuario.find(estado, 'nombre email estado').exec();
  return usuarios;
}

//MÉTODO PARA CREAR UN USUARIO EN LA BBDD
async function crearUsuario(body) {
  const saltRounds = await bcrypt.genSalt(10);
  const myPlaintextPassword = body.password;
  const crypted = await bcrypt.hash(myPlaintextPassword, saltRounds);
  let usuario = new Usuario({
    email: body.email,
    nombre: body.nombre,
    password: crypted
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