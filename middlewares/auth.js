var jwt = require('jsonwebtoken');
const config = require('config');

//MIDDLEWARE PARA VALIDAR TOKEN PARA ACCEDER A LAS PETICIONES
let validarToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, config.get('configToken.secret'), (err, decoded) => {
      if (err) {
        return res.status(401).json(err)
      }
      req.usuario = decoded;
      next();
    });
  }

  module.exports = validarToken;