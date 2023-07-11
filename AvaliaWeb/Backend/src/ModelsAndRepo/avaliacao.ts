import {IUsuario} from './usuario.js'
import { ITurma } from './turma.js';
import { IAvaliacaoProfessor , RepositorioAvaliacaoProfessor} from './avaliacaoProfessor.js';

export interface IAvaliacao{
    usuario? : IUsuario;
    turma? : ITurma;
    nota? : number;
    texto? : string;
    avaliacaoProfessores? : IAvaliacaoProfessor[];
    ativo?: boolean;
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
            texto : avaliacaoRow.TEXTO,
            ativo: avaliacaoRow.ATIVO
        }
    })

    static Save(avaliacao : IAvaliacao) : Promise<string>{
        return new Promise((resolve, reject) => {
            RepositorioAvaliacao.Get(avaliacao)
            .then(result => {
                //CADASTRO
                if(result.length == 0){
                    global.db.query(
                        "INSERT INTO AVALIACAO VALUES(?,?,?,?,?,?,?)", 
                    [   avaliacao.usuario.matricula, avaliacao.turma.periodo.codigo,
                        avaliacao.turma.disciplina.codigo, avaliacao.turma.codigo,
                        avaliacao.nota, avaliacao.texto, true
                    ], (err, result) => {
                        if (err) reject(err);
                        //cadastra avaliação de professores
                        else if (avaliacao.avaliacaoProfessores?.length){
                            let saves : Promise<string>[] = [];
                            avaliacao.avaliacaoProfessores.forEach(ap => { 
                                saves.push(RepositorioAvaliacaoProfessor.Save({...ap, avaliacao: avaliacao}));
                            });
                            Promise.all(saves)
                            .then( () =>{
                                resolve("Avaliação cadastrada com sucesso");
                            })
                            .catch( err =>{
                                reject(err);
                            });
                        }
                        else{
                            resolve("Avaliação cadastrada com sucesso");
                        }
                    });
                }
                //EDIÇÃO
                else{
                    global.db.query(
                        `UPDATE AVALIACAO 
                         SET NOTA = ?, TEXTO = ?
                         WHERE  USUARIO_MATRICULA = ? AND 
                         TURMA_PERIODO_CODIGO = ? AND 
                         TURMA_DISCIPLINA_CODIGO = ? AND 
                         TURMA_CODIGO = ?`, 
                    [   avaliacao.nota, 
                        avaliacao.texto, 
                        avaliacao.usuario.matricula, 
                        avaliacao.turma.periodo.codigo,
                        avaliacao.turma.disciplina.codigo,
                        avaliacao.turma.codigo
                    ], (err, result) => {
                        if (err) reject(err);
                        //atualiza avaliação de professores
                        else if (avaliacao.avaliacaoProfessores?.length){
                            let saves : Promise<string>[] = [];
                            avaliacao.avaliacaoProfessores.forEach(ap => { 
                                saves.push(RepositorioAvaliacaoProfessor.Save({...ap, avaliacao: avaliacao}));
                            });
                            Promise.all(saves)
                            .then( () =>{
                                resolve("Avaliação editada com sucesso");
                            })
                            .catch( err =>{
                                reject(err);
                            });
                        }
                        else{
                            resolve("Avaliação editada com sucesso");
                        }
                    });
                }
            })
            .catch(err => reject(err));
        })
    }

    static Delete(avaliacao : IAvaliacao) : Promise<void>{
        return new Promise((resolve, reject) => {
            //deleta avaliações de professores
            RepositorioAvaliacaoProfessor.Delete({avaliacao:avaliacao})
            .then( () =>{
                global.db.query(
                    `DELETE FROM AVALIACAO
                        WHERE  USUARIO_MATRICULA = ? AND 
                            TURMA_PERIODO_CODIGO = ? AND 
                            TURMA_DISCIPLINA_CODIGO = ? AND 
                            TURMA_CODIGO = ?
                            AND ATIVO = 1`, 
                [   avaliacao.usuario.matricula, avaliacao.turma.periodo.codigo,
                    avaliacao.turma.disciplina.codigo, avaliacao.turma.codigo
                ], (err, result) => {
                    if (err) reject(err);
                    else resolve();
                });
            })
            .catch( err =>{
                reject(err);
            })
        })
    }

    static Get(filtro : IAvaliacaoFilter) : Promise<IAvaliacao[] | undefined>{
        let query : string = 
            `SELECT * 
             FROM AVALIACAO 
             WHERE 1=1
        ${filtro.usuario?.matricula != null ? 
            `AND USUARIO_MATRICULA = ${filtro.usuario.matricula}` : ``}
        ${filtro.turma?.periodo?.codigo  != null ? 
            `AND TURMA_PERIODO_CODIGO =  ${filtro.turma.periodo.codigo}` : ``}
        ${filtro.turma?.disciplina?.codigo != null ?
            `AND TURMA_DISCIPLINA_CODIGO =  ${filtro.turma.disciplina.codigo}  ` : ``}
        ${filtro.turma?.codigo != null ?
            `AND TURMA_CODIGO =  ${filtro.turma.codigo}  ` : ``}
        ${filtro.notaMin != null ? 
            `AND NOTA >= ${filtro.notaMin}` : ``}
        ${filtro.notaMax != null ? 
            `AND NOTA <= ${filtro.notaMax}` : ``}`;

        return new Promise((resolve, reject) => {
            global.db.query(query, (err, result) => {
                if (err) reject(err);
                else {
                    if(result?.[0]){
                        const promises: Promise<IAvaliacao>[] = result.map(ava => {
                            const avaliacao = RepositorioAvaliacao.Map(ava);
                            return RepositorioAvaliacaoProfessor.Get({avaliacao:avaliacao})
                            .then(avaProf =>{
                                avaliacao.avaliacaoProfessores = avaProf;
                                return avaliacao;
                            })
                            .catch(err => {return avaliacao})
                        });
                        Promise.all(promises).then(avaliacoes =>{
                            resolve(avaliacoes);
                        })
                    }
                    else resolve([]);
                }
            });
        })
    }
}