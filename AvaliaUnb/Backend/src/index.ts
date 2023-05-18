import express from 'express';
import mysql from 'mysql';
import endpoints from './endpoints.js';

//instanciando o servidor
global.app = express();

//declarando conexão com o BD
global.db = mysql.createConnection({
    host:"localhost",
    user:"AvaliaUnbBackend",
    password:"AvaliaUnbSenha",
    database: "avaliaunb"
});

//iniciando conexão
global.db.connect((err) => {
    if (err) throw err;
    console.log("Conectado ao BD com sucesso");
});

endpoints();

//inicializando servidor
global.app.listen(3000, () =>{
    console.log("rodando na porta 3000");
});