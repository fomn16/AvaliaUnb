import express from 'express';
import mysql from 'mysql';
import endpoints from './endpoints.js';

//instanciando o servidor
var app = express();

//declarando conexão com o BD
var db = mysql.createConnection({
    host:"localhost",
    user:"AvaliaUnbBackend",
    password:"AvaliaUnbSenha",
    database: "avaliaunb"
});

endpoints(app, db);

//inicializando servidor
app.listen(3000, () =>{
    console.log("running on port 3000");
});

