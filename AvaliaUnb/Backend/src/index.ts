import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser'

//instanciando o servidor
global.app = express();
global.app.use(bodyParser.json());
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

import('./passport.js')
import('./Endpoints/endpoints.js')

//inicializando servidor
global.app.listen(3000, () =>{
    console.log("rodando na porta 3000");
});