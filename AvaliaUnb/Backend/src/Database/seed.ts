import fs from 'fs'
import csv from 'csv-parser'
import mysql from 'mysql'

//preparação
const db = mysql.createConnection({
    host:"localhost",
    user:"AvaliaUnbBackend",
    password:"AvaliaUnbSenha",
    database:"avaliaunb"
});

const runQuery = (query:string) => {
    db.query(query, (error, results, fields) => {
        if (error) throw error;
        console.log('Statement executado com sucesso:  ', query.slice(0,50));
    });
}

const insertStatement = (table: string, values: string) => {
    const statement = 'INSERT IGNORE INTO ' + table + ' VALUES ' + values;
    runQuery(statement);
}

const readCsv = (filename) : Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream('./src/Database/data/' + filename + '.csv')
          .pipe(csv({ separator: ',' }))
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', reject);
      });
}


//departamentos
let results = await readCsv('departamentos');
let values = "";
results.forEach(result => {
    values += "(" + result.cod + ",'" + result.nome + "'),";
});
values = values.slice(0, -1);
insertStatement('DEPARTAMENTO', values)


//disciplinas
results = await readCsv('disciplinas');
values = "";
results.forEach(result => {
    values += "('" + result.cod + "','" + result.nome + "','" + result.cod_depto + "'),";
});
values = values.slice(0, -1);
insertStatement('DISCIPLINA(CODIGO_TXT, NOME, DEPARTAMENTO_CODIGO)', values)


//lendo turmas para preencher o resto das tabelas
results = await readCsv('turmas');
results = results.filter( r => r.horario != '' && r.total_vagas != '' && r.local != '')

//criando tabela temporária para guardar as informações
runQuery('CREATE TEMPORARY TABLE TEMP_TURMAS (TURMA VARCHAR(10),PERIODO VARCHAR(45),PROFESSOR VARCHAR(80),HORARIO VARCHAR(15),VAGAS_OCUPADAS INT,TOTAL_VAGAS INT,LOCAL VARCHAR(45),COD_DISCIPLINA VARCHAR(45),COD_DEPTO INT);');
values = "";
results.forEach(result => {
    values += "('" + result.turma + "','" + result.periodo + "','" + result.professor + "','" + result.horario + "'," + result.vagas_ocupadas + "," + result.total_vagas + ",'" + result.local + "','" + result.cod_disciplina + "'," + result.cod_depto +"),";
});
values = values.slice(0, -1);
insertStatement('TEMP_TURMAS', values);

//inserindo valores em professor, periodo, local e turma
let query = 
"INSERT IGNORE INTO PROFESSOR(NOME, DEPARTAMENTO_CODIGO) "+
"SELECT T.PROFESSOR, T.COD_DEPTO "+
"FROM TEMP_TURMAS T;";
runQuery(query);

query = 
"INSERT IGNORE INTO PERIODO(NOME) "+
"SELECT T.PERIODO FROM TEMP_TURMAS T;";
runQuery(query);

query = 
"INSERT IGNORE INTO LOCAL(NOME) "+
"SELECT T.LOCAL FROM TEMP_TURMAS T;";
runQuery(query);

query = 
"INSERT INTO TURMA (PERIODO_CODIGO, DISCIPLINA_CODIGO, CODIGO_TXT, VAGAS_OCUPADAS, TOTAL_VAGAS, LOCAL_CODIGO, PROFESSOR_CODIGO, TURNO) "+
"SELECT P.CODIGO, D.CODIGO, T.TURMA, T.VAGAS_OCUPADAS, T.TOTAL_VAGAS, L.CODIGO, PR.CODIGO, SUBSTRING(T.HORARIO, REGEXP_INSTR(T.HORARIO, '[^0-9]'), 1) "+
"FROM TEMP_TURMAS T "+
"INNER JOIN PERIODO P ON P.NOME = T.PERIODO "+
"INNER JOIN DISCIPLINA D ON D.CODIGO_TXT = T.COD_DISCIPLINA "+
"INNER JOIN LOCAL L ON L.NOME = T.LOCAL "+
"INNER JOIN PROFESSOR PR ON PR.NOME = T.PROFESSOR;";
runQuery(query);

//criando tabelas temporárias para registrar dias e horas em tuplas separadas
runQuery('CREATE TEMPORARY TABLE TEMP_DIAS (DIA TINYINT(2), TURMA VARCHAR(10),PERIODO VARCHAR(45),COD_DISCIPLINA VARCHAR(45));');
runQuery('CREATE TEMPORARY TABLE TEMP_HORAS (HORA TINYINT(2), TURMA VARCHAR(10),PERIODO VARCHAR(45),COD_DISCIPLINA VARCHAR(45));');
let dias = "";
let horas = "";
results.forEach(result => {
    const match = result.match(/^(\d*)(\D)(\d*)/);
    for(const d of match[1])
        dias += "(" + d +"'," + result.turma + "','" + result.periodo + "','" + result.cod_disciplina + "'),";
    for(const h of match[3])
        horas += "(" + h +"'," + result.turma + "','" + result.periodo + "','" + result.cod_disciplina + "'),";
});
dias = dias.slice(0, -1);
horas = horas.slice(0, -1);
insertStatement('TEMP_DIAS', dias);
insertStatement('TEMP_HORAS', horas);

query = 
"INSERT INTO TURMA (PERIODO_CODIGO, DISCIPLINA_CODIGO, CODIGO_TXT, VAGAS_OCUPADAS, TOTAL_VAGAS, LOCAL_CODIGO, PROFESSOR_CODIGO, TURNO) "+
"SELECT P.CODIGO, D.CODIGO, T.TURMA, T.VAGAS_OCUPADAS, T.TOTAL_VAGAS, L.CODIGO, PR.CODIGO, SUBSTRING(T.HORARIO, REGEXP_INSTR(T.HORARIO, '[^0-9]'), 1) "+
"FROM TEMP_TURMAS T "+
"INNER JOIN PERIODO P ON P.NOME = T.PERIODO "+
"INNER JOIN DISCIPLINA D ON D.CODIGO_TXT = T.COD_DISCIPLINA "+
"INNER JOIN LOCAL L ON L.NOME = T.LOCAL "+
"INNER JOIN PROFESSOR PR ON PR.NOME = T.PROFESSOR;";
runQuery(query);

db.end();