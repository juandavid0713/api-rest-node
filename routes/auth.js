const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require("../models/usuario_model");
var jwt = require('jsonwebtoken');
const config = require('config');

const ruta = express.Router();

ruta.post('/', (req, res) => {
    let usuario = findUser(req.body.email);
    usuario.then(user => {
        if (user) {
            async function checkUser(password) {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const token = jwt.sign({
                        _id: user._id, nombre:user.nombre,email:user.email }, 
                        config.get('configToken.secret'),
                        { expiresIn: config.get('configToken.expirationTime') },
                        (err,token)=>{
                        return res.json({token:token});
                    });
                    //return res.json({token:token})
                }
                else {
                    return res.json({mensaje:"Usuario o contraseña incorrecto"})
                }
            }
            checkUser(req.body.password);
        } else {
            return res.status(400).json({mensaje:"Usuario o contraseña incorrecto"})
        }

    }).catch(err => {
        res.json(err)
    });
})

async function findUser(correo) {
    const usuario = await Usuario.findOne({ email: correo }).exec();
    return usuario;
}

module.exports = ruta;