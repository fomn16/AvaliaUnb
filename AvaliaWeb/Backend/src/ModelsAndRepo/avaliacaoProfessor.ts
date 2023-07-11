import {IAvaliacao, IAvaliacaoFilter} from './avaliacao.js'
import {IProfessor, IProfessorFilter} from './professor.js'
import { ITurmaProfessor, RepositorioTurmaProfessor} from './turmaProfessor.js';
import {TreatedResponse} from './treatedResponse.js'

export interface IAvaliacaoProfessor{
    avaliacao?: IAvaliacao;
    professor?: IProfessor;
    nota?: number;
    texto?:string;
}

export interface IAvaliacaoProfessorFilter{
    avaliacao?: IAvaliacaoFilter;
    professor?: IProfessorFilter;
    notaMin?: number;
    notaMax?: number;
}

export class RepositorioAvaliacaoProfessor{
    static Map = ((avaliacaoProfessorRow) : IAvaliacaoProfessor => {
        return {
            avaliacao:{
                usuario : {matricula : avaliacaoProfessorRow.AVALIACAO_USUARIO_MATRICULA},
                turma : {   
                            codigo : avaliacaoProfessorRow.AVALIACAO_TURMA_CODIGO,
                            periodo : {codigo: avaliacaoProfessorRow.AVALIACAO_TURMA_PERIODO_CODIGO},
                            disciplina : {codigo : avaliacaoProfessorRow.AVALIACAO_TURMA_DISCIPLINA_CODIGO}
                        }
            },
            professor:{
                codigo: avaliacaoProfessorRow.PROFESSOR_CODIGO
            },
            nota: avaliacaoProfessorRow.NOTA,
            texto: avaliacaoProfessorRow.TEXTO
        }
    })
    
    static Save(avaliacaoProfessor : IAvaliacaoProfessor) : Promise<string>{
        return new Promise((resolve, reject) => {
            RepositorioAvaliacaoProfessor.Get(avaliacaoProfessor)
            .then(result => {
                //CADASTRO
                if(result.length == 0){
                    RepositorioTurmaProfessor.Get({turma:avaliacaoProfessor.avaliacao.turma, professor:avaliacaoProfessor.professor})
                    .then(tp =>{
                        if(tp.length == 0)
                            reject(new TreatedResponse("Professor não está ligado à turma"));
                        else{
                            global.db.query(
                                "INSERT INTO AVALIACAO_PROFESSOR VALUES(?,?,?,?,?,?,?)", 
                            [   avaliacaoProfessor.avaliacao.usuario.matricula, 
                                avaliacaoProfessor.avaliacao.turma.periodo.codigo,
                                avaliacaoProfessor.avaliacao.turma.disciplina.codigo, 
                                avaliacaoProfessor.avaliacao.turma.codigo,
                                avaliacaoProfessor.professor.codigo,
                                avaliacaoProfessor.nota, 
                                avaliacaoProfessor.texto
                            ], (err, result) => {
                                if (err) reject(err);
                                else resolve("Avaliação cadastrada com sucesso");
                            });
                        }
                    })
                    .catch(err => reject(err))
                }
                //EDIÇÃO
                else{
                    global.db.query(
                        `UPDATE AVALIACAO_PROFESSOR 
                         SET NOTA = ?, TEXTO = ?
                         WHERE  AVALIACAO_USUARIO_MATRICULA = ? AND 
                         AVALIACAO_TURMA_PERIODO_CODIGO = ? AND 
                         AVALIACAO_TURMA_DISCIPLINA_CODIGO = ? AND 
                         AVALIACAO_TURMA_CODIGO = ? AND
                         PROFESSOR_CODIGO = ?`, 
                    [   avaliacaoProfessor.nota, 
                        avaliacaoProfessor.texto,
                        avaliacaoProfessor.avaliacao.usuario.matricula,
                        avaliacaoProfessor.avaliacao.turma.periodo.codigo,
                        avaliacaoProfessor.avaliacao.turma.disciplina.codigo,
                        avaliacaoProfessor.avaliacao.turma.codigo,
                        avaliacaoProfessor.professor.codigo
                    ], (err, result) => {
                        if (err) reject(err);
                        else resolve("Avaliação editada com sucesso");
                    });
                }
            })
            .catch(err => reject(err));
        })
    }

    static Delete(avaliacaoProfessor : IAvaliacaoProfessor) : Promise<void>{
        return new Promise((resolve, reject) => {
            global.db.query(
                `DELETE FROM AVALIACAO_PROFESSOR
                 WHERE  AVALIACAO_USUARIO_MATRICULA = ? AND 
                 AVALIACAO_TURMA_PERIODO_CODIGO = ? AND 
                 AVALIACAO_TURMA_DISCIPLINA_CODIGO = ? AND 
                 AVALIACAO_TURMA_CODIGO = ? 
                 ${avaliacaoProfessor.professor?.codigo ? 
                `AND PROFESSOR_CODIGO = ?` : ``}`,
            [   avaliacaoProfessor.avaliacao.usuario.matricula, 
                avaliacaoProfessor.avaliacao.turma.periodo.codigo,
                avaliacaoProfessor.avaliacao.turma.disciplina.codigo, 
                avaliacaoProfessor.avaliacao.turma.codigo,
                avaliacaoProfessor.professor?.codigo
            ], (err, result) => {
                if (err) reject(err);
                else resolve();
            }); 
        })
    }

    static Get(filtro : IAvaliacaoProfessorFilter) : Promise<IAvaliacaoProfessor[] | undefined>{
        let query : string = 
            `SELECT * 
             FROM AVALIACAO_PROFESSOR 
             WHERE 1=1
        ${filtro.avaliacao?.usuario?.matricula != null ? 
            `AND AVALIACAO_USUARIO_MATRICULA = ${filtro.avaliacao?.usuario.matricula}` : ``}
        ${filtro.avaliacao?.turma?.periodo?.codigo != null ? 
            `AND AVALIACAO_TURMA_PERIODO_CODIGO =  ${filtro.avaliacao?.turma.periodo.codigo}` : ``}
        ${filtro.avaliacao?.turma?.disciplina?.codigo != null ?
            `AND AVALIACAO_TURMA_DISCIPLINA_CODIGO =  ${filtro.avaliacao?.turma.disciplina.codigo}  ` : ``}
        ${filtro.avaliacao?.turma?.codigo != null ?
            `AND AVALIACAO_TURMA_CODIGO =  ${filtro.avaliacao?.turma.codigo}  ` : ``}
        ${filtro.professor?.codigo != null ?
            `AND PROFESSOR_CODIGO =  ${filtro.professor.codigo}  ` : ``}
        ${filtro.notaMin != null ? 
            `AND NOTA >= ${filtro.notaMin}` : ``}
        ${filtro.notaMax != null ? 
            `AND NOTA <= ${filtro.notaMax}` : ``}`;
        return new Promise((resolve, reject) => {
            global.db.query(query, (err, result) => {
                if (err) reject(err);
                else {
                    if(result?.[0]){
                        let ret : IAvaliacaoProfessor[] = [];
                        result.forEach(avaProf => {
                            ret.push(RepositorioAvaliacaoProfessor.Map(avaProf));
                        }); 
                        resolve(ret);
                    }
                    else resolve([]);
                }
            });
        })
    }
}