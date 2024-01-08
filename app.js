const express = require('express');
const mongoose = require('mongoose');
const cursos = require("./routes/cursos");
const usuarios = require("./routes/usuarios");
const auth = require("./routes/auth");
const config = require('config');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/cursos",cursos);
app.use("/api/usuarios",usuarios);
app.use("/api/auth",auth);


mongoose.connect(config.get('configDB.HOST'))
    .then(() => { console.log("conectado a mongodb") })
    .catch(err => console.log("no se pudo conectar", err));



const port = 3000;

app.listen(port, () => console.log("escuchando en el puerto 3000"));