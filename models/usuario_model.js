const mongoose = require('mongoose');

//CREACIÓN DEL ESQUEMA DE LA TABLA (COLECCION EN MONGODB)
const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    imagen: {
        type: String,
        required: false
    }
})

//EXPORTE DEL MODELO DE USUARIO E INSTANCIA DE LA CLASE DEL ESQUEMA DE MONGODB
module.exports = mongoose.model('usuario', usuarioSchema);
