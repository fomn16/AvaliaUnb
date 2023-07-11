import fs from 'fs'
import mysql from 'mysql'

//declarando conexão com o BD
const db = mysql.createConnection({
    host:"localhost",
    user:"AvaliaUnbBackend",
    password:"AvaliaUnbSenha"
});

const sqlScript = fs.readFileSync('./src/Database/data/Create_Schema.sql', 'utf8');

// Separando statements
const sqlStatements = sqlScript.split(';');

// Removendo statements vazios
const statements = sqlStatements.filter((statement) => statement.trim() !== '');

// Executando statements
statements.forEach((statement) => {
  db.query(statement, (error, results, fields) => {
    if (error) throw error;
    console.log('Statement executado com sucesso:', statement);
  });
});

// Terminando a conexão
db.end();