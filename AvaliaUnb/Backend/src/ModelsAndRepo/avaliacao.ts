import {IUsuario} from './usuario.js'
import { ITurma } from './turma.js';

export interface IAvaliacao{
    usuario? : IUsuario;
    turma? : ITurma;
    nota : number;
    texto? : string;
}

export interface IAvaliacaoFilter{
    usuario? : IUsuario;
    turma? : ITurma;
    notaMin? : number;
    notaMax? : number;
}

export class RepositorioAvaliacao{
    static Map = ((avaliacaoRow) : IAvaliacao => {
        return {
            usuario : {matricula : avaliacaoRow.USUARIO_MATRICULA},
            turma : {   
                        codigo : avaliacaoRow.TURMA_CODIGO,
                        periodo : {codigo: avaliacaoRow.TURMA_PERIODO_CODIGO},
                        disciplina : {codigo : avaliacaoRow.TURMA_DISCIPLINA_CODIGO}
                    },
            nota : avaliacaoRow.NOTA,
            texto : avaliacaoRow.TEXTO
        }
    })
    
    static Save(avaliacao : IAvaliacao) : Promise<string>{
        return new Promise((resolve, reject) => {
            global.db.query(
                `SELECT COUNT(*) CNT
                 FROM AVALIACAO 
                 WHERE  USUARIO_MATRICULA = ? AND 
                        TURMA_PERIODO_CODIGO = ? AND 
                        TURMA_DISCIPLINA_CODIGO = ? AND 
                        TURMA_CODIGO = ?`,
            [   avaliacao.usuario.matricula, 
                avaliacao.turma.periodo.codigo,
                avaliacao.turma.disciplina.codigo, 
                avaliacao.turma.codigo
            ],(err, result) => {
                if (err) return reject(err);
                //CADASTRO
                if(result?.[0].CNT == 0){
                    global.db.query(
                        "INSERT INTO AVALIACAO VALUES(?,?,?,?,?,?)", 
                    [   avaliacao.usuario.matricula, avaliacao.turma.periodo.codigo,
                        avaliacao.turma.disciplina.codigo, avaliacao.turma.codigo,
                        avaliacao.nota, avaliacao.texto
                    ], (err, result) => {
                        if (err) return reject(err);
                        return resolve("Avaliação cadastrada com sucesso");
                    });
                }
                //EDIÇÃO
                else{
                    global.db.query(
                        `UPDATE AVALIACAO 
                         SET NOTA = ?, TEXTO = ?`, 
                    [avaliacao.nota, avaliacao.texto], (err, result) => {
                        if (err) return reject(err);
                        return resolve("Avaliação editada com sucesso");
                    });
                }
            });
        })
    }

    static Delete(avaliacao : IAvaliacao) : Promise<void>{
        return new Promise((resolve, reject) => {
            global.db.query(
                `DELETE FROM AVALIACAO
                 WHERE  USUARIO_MATRICULA = ? AND 
                        TURMA_PERIODO_CODIGO = ? AND 
                        TURMA_DISCIPLINA_CODIGO = ? AND 
                        TURMA_CODIGO = ?`, 
            [   avaliacao.usuario.matricula, avaliacao.turma.periodo.codigo,
                avaliacao.turma.disciplina.codigo, avaliacao.turma.codigo
            ], (err, result) => {
                if (err) return reject(err);
                return resolve();
            }); 
        })
    }

    static Get(filtro : IAvaliacaoFilter) : Promise<IAvaliacao[] | undefined>{
        let query : string = 
            `SELECT * 
             FROM AVALIACAO 
             WHERE 1=1
        ${filtro.usuario?.matricula != null ? 
            `AND USUARIO_MATRICULA = ${filtro.usuario.matricula}` : ``}
        ${filtro.turma?.codigo != null && filtro.turma?.disciplina?.codigo != null && filtro.turma?.periodo?.codigo != null ? 
            `AND TURMA_PERIODO_CODIGO =  ${filtro.turma.periodo.codigo}
             AND TURMA_DISCIPLINA_CODIGO =  ${filtro.turma.disciplina.codigo}
             AND TURMA_CODIGO =  ${filtro.turma.codigo}  ` : ``}
        ${filtro.notaMin != null ? 
            `AND NOTA >= ${filtro.notaMin}` : ``}
        ${filtro.notaMax != null ? 
            `AND NOTA <= ${filtro.notaMax}` : ``}`;

        return new Promise((resolve, reject) => {
            global.db.query(query, (err, result) => {
                if (err) reject(err);
                else {
                    if(result?.[0]){
                        let ret : IAvaliacao[] = [];
                        result.forEach(ava => {
                            ret.push(RepositorioAvaliacao.Map(ava));
                        }); 
                        resolve(ret);
                    }
                    else resolve([]);
                }
            });
        })
    }
}