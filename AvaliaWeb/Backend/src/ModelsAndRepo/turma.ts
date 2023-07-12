import {ILocal} from './local.js'
import {IPeriodo} from './periodo.js'
import { IDisciplina } from './disciplina.js';
import { IProfessor } from './professor.js';

export interface ITurma{
    codigo? : string;
    periodo? : IPeriodo;
    disciplina? : IDisciplina;
    vagasOcupadas? : number;
    totalVagas? : number;
    local? : ILocal;
    turno? : string;
}

export interface ITurmaFilter{
    disciplinaNome?: string;
    disciplinaSigla?: string;
    periodo?: string;
    professor?: string;
}


export class RepositorioTurma{
    static Map = ((turmaRow) : ITurma => {
        return {
            codigo: turmaRow.CODIGO,
            periodo: {codigo: turmaRow.PERIODO_CODIGO, nome: turmaRow.PERIODO},
            disciplina: {codigo:turmaRow.DISCIPLINA_CODIGO, codigoTxt: turmaRow.DISCIPLINA_SIGLA, nome: turmaRow.DISCIPLINA_NOME}
        }
    })

    static ListProfessores(filtro : ITurma) : Promise<IProfessor[] | undefined>{
        let query : string = 
            `SELECT DISTINCT PROFESSOR_CODIGO, PROFESSOR_NOME
             FROM TURMA_VIEW 
             WHERE CODIGO = ${filtro.codigo}
             AND PERIODO_CODIGO = ${filtro.periodo.codigo}
             AND DISCIPLINA_CODIGO = ${filtro.disciplina.codigo}
            `;

        return new Promise((resolve, reject) => {
            global.db.query(query, (err, result) => {
                if (err) reject(err);
                else {
                    if(result?.[0]){
                        const promises: Promise<IProfessor>[] = result.map(res => {
                            return {codigo: res.PROFESSOR_CODIGO, nome:res.PROFESSOR_NOME}; 
                        });
                        Promise.all(promises).then(professores =>{
                            resolve(professores);
                        })
                    }
                    else resolve([]);
                }
            });
        })
    }

    static List(filtro : ITurmaFilter) : Promise<ITurma[] | undefined>{
        let query : string = 
            `SELECT  DISTINCT CODIGO, PERIODO_CODIGO, PERIODO, DISCIPLINA_CODIGO, DISCIPLINA_SIGLA, DISCIPLINA_NOME
             FROM TURMA_VIEW 
             WHERE 1=1
        ${filtro.disciplinaNome != null ? 
            `AND DISCIPLINA_NOME LIKE "\%${filtro.disciplinaNome}\%" ` : ``}
        ${filtro.disciplinaSigla  != null ? 
            `AND DISCIPLINA_SIGLA LIKE  "\%${filtro.disciplinaSigla}\%" ` : ``}
        ${filtro.periodo != null ?
            `AND PERIODO LIKE  "\%${filtro.periodo}\%" ` : ``}
        ${filtro.professor != null ?
            `AND PROFESSOR_NOME LIKE  "\%${filtro.professor}\%"  ` : ``}
        
            LIMIT 100`;

        return new Promise((resolve, reject) => {
            global.db.query(query, (err, result) => {
                if (err) reject(err);
                else {
                    if(result?.[0]){
                        const promises: Promise<ITurma>[] = result.map(tur => {
                            return RepositorioTurma.Map(tur); 
                        });
                        Promise.all(promises).then(turmas =>{
                            resolve(turmas);
                        })
                    }
                    else resolve([]);
                }
            });
        })
    }
}