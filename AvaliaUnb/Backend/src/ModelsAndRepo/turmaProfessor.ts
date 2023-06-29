import { IProfessor } from './professor.js';
import { ITurma } from './turma.js';

export interface ITurmaProfessor{
    turma?: ITurma;
    professor?: IProfessor;
}

export class RepositorioTurmaProfessor{
    static Map = ((turmaProfessorRow) : ITurmaProfessor => {
        return {
            turma:{
                codigo:turmaProfessorRow.TURMA_CODIGO,
                periodo:{codigo:turmaProfessorRow.TURMA_PERIODO_CODIGO},
                disciplina:{codigo:turmaProfessorRow.TURMA_DISCIPLINA_CODIGO}
            },
            professor:{codigo:turmaProfessorRow.PROFESSOR_CODIGO}
        }
    })

    static Get(filtro : ITurmaProfessor) : Promise<ITurmaProfessor[] | undefined>{
        let query : string = 
            `SELECT * 
             FROM TURMA_PROFESSOR
             WHERE 1=1
        ${filtro.turma?.codigo != null ? 
            `AND TURMA_CODIGO = ${filtro.turma.codigo}` : ``}
        ${filtro.turma?.periodo?.codigo != null ? 
            `AND TURMA_PERIODO_CODIGO = ${filtro.turma.periodo.codigo}` : ``}
        ${filtro.turma?.disciplina?.codigo != null ? 
            `AND TURMA_DISCIPLINA_CODIGO = ${filtro.turma.disciplina.codigo}` : ``}
        ${filtro.professor?.codigo != null ? 
            `AND PROFESSOR_CODIGO = ${filtro.professor.codigo}` : ``}`;

        return new Promise((resolve, reject) => {
            global.db.query(query, (err, result) => {
                if (err) reject(err);
                else {
                    if(result?.[0]){
                        resolve(result.map(tp => RepositorioTurmaProfessor.Map(tp)));
                    }
                    else{
                        resolve([]);
                    }
                }
            });
        })
    }
}