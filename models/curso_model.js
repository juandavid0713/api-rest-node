const mongoose = require('mongoose');

//CREACIÓN DEL ESQUEMA DE LA TABLA (COLECCION EN MONGODB)
const cursoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
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
    },
    alumnos:{
        type: Number,
        default:0
    },
    califica:{
        type:Number,
        default:0
    }
})

//EXPORTE DEL MODELO DE USUARIO E INSTANCIA DE LA CLASE DEL ESQUEMA DE MONGODB
module.exports = mongoose.model('Curso',cursoSchema);
