const express = require('express');
const Curso = require("../models/curso_model");
const Joi = require('joi');
const validarToken = require('../middlewares/auth');


const ruta = express.Router();

//VALIDAR BODY CON JOI PARA CONTROLAR DATOS
const schema = Joi.object({
  titulo: Joi.string().required(),
  descripcion: Joi.string().min(8).required()
});


//RUTA GET
ruta.get('/',validarToken, (req, res) => {
  let listadoCursos = listarCursos();
  listadoCursos.then(cursos => {
    res.json(cursos)
  }).catch(err => {
    res.status(400).json(err)
  })
});

//RUTA POST
ruta.post('/', validarToken, (req, res) => {
  const { error, value } = schema.validate({
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
  });
  if (!error) {
    let crearCurso = crearCursos(req);
    crearCurso.then(curso => {
      res.json(curso);
    }).catch(err => {
      res.status(400).json(err);
    })
  } else {
    res.status(400).json(error)
  }
});

//RUTA PUT
ruta.put('/:id', validarToken, (req, res) => {
  const { error, value } = schema.validate({
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
  });
  if (!error) {
    let actualizarCurso = actualizarCursos(req.params.id,req.body);
    actualizarCurso.then(curso => {
      res.json(curso);
    }).catch(err => {
      res.status(400).json(err);
    })
  } else {
    res.status(400).json(error)
  }
});

//MÉTODO PARA LISTAR LOS CURSOS
async function listarCursos() {
  let cursos = await Curso.find({}).populate('autor','nombre');
  return cursos;
}


//MÉTODO PARA CREAR UN CURSO EN LA BBDD
async function crearCursos(req) {
  let curso = new Curso({
    titulo: req.body.titulo,
    autor: req.usuario._id,
    descripcion: req.body.descripcion
  });
  return await curso.save();
}

//MÉTODO PARA ACTUALIZAR UN CURSO EN LA BBDD
async function actualizarCursos(id,body) {
    let curso = await Curso.findByIdAndUpdate(id, {
    titulo: body.titulo,
    descripcion: body.descripcion
  }, { new: true });
  return curso;
}

module.exports = ruta;