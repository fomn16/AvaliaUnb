import {IUsuario} from './usuario.js'
import { IAvaliacao } from './avaliacao.js';

export interface IDenuncia{
    usuario? : IUsuario;
    avaliacao? : IAvaliacao;
    texto? : string;
    aceita?: boolean;
}

export enum Operacao{
    Ignorar = 0,
    Aceitar = 1,
    AceitarExpulsando = 2
}

export interface Processo{
    operacao? : Operacao;
    denuncia? : IDenuncia;
}

export class RepositorioDenuncia{
    static Map = ((denunciaRow) : IDenuncia => {
        return {
            usuario : {matricula : denunciaRow.USUARIO_MATRICULA},
            avaliacao: {
                usuario : {matricula : denunciaRow.AVALIACAO_USUARIO_MATRICULA},
                turma : {   
                    codigo : denunciaRow.AVALIACAO_TURMA_CODIGO,
                    periodo : {codigo: denunciaRow.AVALIACAO_TURMA_PERIODO_CODIGO},
                    disciplina : {codigo : denunciaRow.AVALIACAO_TURMA_DISCIPLINA_CODIGO}
                },
                nota:denunciaRow.AVALIACAO_NOTA,
                texto: denunciaRow.AVALIACAO_TEXTO
            },
            texto : denunciaRow.TEXTO,
            aceita: denunciaRow.ACEITA
        }
    })

    static Save(denuncia : IDenuncia) : Promise<string>{
        return new Promise((resolve, reject) => {
            RepositorioDenuncia.Get(denuncia)
            .then(result => {
                //CADASTRO
                if(result.length == 0){
                    global.db.query(
                        "INSERT INTO DENUNCIA VALUES(?,?,?,?,?,?,?)", 
                    [   denuncia.usuario.matricula, 
                        denuncia.avaliacao.usuario.matricula, 
                        denuncia.avaliacao.turma.periodo.codigo,
                        denuncia.avaliacao.turma.disciplina.codigo, 
                        denuncia.avaliacao.turma.codigo,
                        denuncia.texto, 
                        false
                    ], (err, result) => {
                        if (err) reject(err);
                        else{
                            resolve("Denúncia cadastrada com sucesso");
                        }
                    });
                }
                //EDIÇÃO
                else{
                    global.db.query(
                        `UPDATE DENUNCIA 
                         SET TEXTO = ?
                         WHERE USUARIO_MATRICULA = ? AND 
                         AVALIACAO_USUARIO_MATRICULA = ? AND
                         AVALIACAO_TURMA_PERIODO_CODIGO = ? AND 
                         AVALIACAO_TURMA_DISCIPLINA_CODIGO = ? AND 
                         AVALIACAO_TURMA_CODIGO = ?`, 
                    [   
                        denuncia.texto,
                        denuncia.usuario.matricula,
                        denuncia.avaliacao.usuario.matricula, 
                        denuncia.avaliacao.turma.periodo.codigo,
                        denuncia.avaliacao.turma.disciplina.codigo,
                        denuncia.avaliacao.turma.codigo
                    ], (err, result) => {
                        if (err) reject(err);
                        else{
                            resolve("Denuncia editada com sucesso");
                        }
                    });
                }
            })
            .catch(err => reject(err));
        })
    }

    static Delete(denuncia : IDenuncia) : Promise<void>{
        return new Promise((resolve, reject) => {
            global.db.query(
                `DELETE FROM DENUNCIA
                    WHERE  USUARIO_MATRICULA = ? AND 
                        AVALIACAO_USUARIO_MATRICULA = ? AND 
                        AVALIACAO_TURMA_PERIODO_CODIGO = ? AND 
                        AVALIACAO_TURMA_DISCIPLINA_CODIGO = ? AND 
                        AVALIACAO_TURMA_CODIGO = ?`, 
            [   denuncia.usuario.matricula, 
                denuncia.avaliacao.usuario.matricula, 
                denuncia.avaliacao.turma.periodo.codigo,
                denuncia.avaliacao.turma.disciplina.codigo, 
                denuncia.avaliacao.turma.codigo
            ], (err, result) => {
                if (err) reject(err);
                else resolve();
            });
        })
    }

    static Get(filtro : IDenuncia) : Promise<IDenuncia[] | undefined>{
        let query : string = 
            `SELECT D.*, A.NOTA AS AVALIACAO_NOTA, A.TEXTO AS AVALIACAO_TEXTO
             FROM DENUNCIA D
             JOIN AVALIACAO A ON 
             D.AVALIACAO_USUARIO_MATRICULA = A.USUARIO_MATRICULA AND
             D.AVALIACAO_TURMA_PERIODO_CODIGO = A.TURMA_PERIODO_CODIGO AND
             D.AVALIACAO_TURMA_DISCIPLINA_CODIGO = A.TURMA_DISCIPLINA_CODIGO AND
             D.AVALIACAO_TURMA_CODIGO = A.TURMA_CODIGO
             WHERE 1=1
        ${filtro.usuario?.matricula != null ? 
            `AND D.USUARIO_MATRICULA = ${filtro.usuario.matricula}` : ``}
        ${filtro.avaliacao?.usuario?.matricula != null ? 
            `AND AVALIACAO_USUARIO_MATRICULA = ${filtro.avaliacao.usuario.matricula}` : ``}
        ${filtro.avaliacao?.turma?.periodo?.codigo  != null ? 
            `AND AVALIACAO_TURMA_PERIODO_CODIGO =  ${filtro.avaliacao?.turma.periodo.codigo}` : ``}
        ${filtro.avaliacao?.turma?.disciplina?.codigo != null ?
            `AND AVALIACAO_TURMA_DISCIPLINA_CODIGO =  ${filtro.avaliacao?.turma.disciplina.codigo}  ` : ``}
        ${filtro.avaliacao?.turma?.codigo != null ?
            `AND AVALIACAO_TURMA_CODIGO =  ${filtro.avaliacao?.turma.codigo}  ` : ``}
        ${filtro.aceita != null ?
            `AND ACEITA =  ${filtro.aceita}  ` : ``}`;

        return new Promise((resolve, reject) => {
            global.db.query(query, (err, result) => {
                if (err) reject(err);
                else {
                    if(result?.[0]){
                        const promises: Promise<IDenuncia>[] = result.map(den => {
                            return RepositorioDenuncia.Map(den); 
                        });
                        Promise.all(promises).then(denuncias =>{
                            resolve(denuncias);
                        })
                    }
                    else resolve([]);
                }
            });
        })
    }

    static Processar(processo : Processo) : Promise<void>{
        switch(processo.operacao){
            case Operacao.Ignorar:
                return this.ProcessarIgnorar(processo.denuncia)
                break;
            case Operacao.Aceitar:
                return this.ProcessarAceitar(processo.denuncia)
                break;
            case Operacao.AceitarExpulsando:
                return this.ProcessarExpulsar(processo.denuncia)
                break;
        }
    }

    static ProcessarIgnorar(denuncia : IDenuncia) : Promise<void>{
        return new Promise((resolve, reject) => {
            global.db.query(
                `UPDATE DENUNCIA
                 SET ACEITA = 1
                 WHERE  USUARIO_MATRICULA = ? AND 
                    AVALIACAO_USUARIO_MATRICULA = ? AND 
                    AVALIACAO_TURMA_PERIODO_CODIGO = ? AND 
                    AVALIACAO_TURMA_DISCIPLINA_CODIGO = ? AND 
                    AVALIACAO_TURMA_CODIGO = ?`, 
            [   denuncia.usuario.matricula, 
                denuncia.avaliacao.usuario.matricula, 
                denuncia.avaliacao.turma.periodo.codigo,
                denuncia.avaliacao.turma.disciplina.codigo, 
                denuncia.avaliacao.turma.codigo
            ], (err, result) => {
                if (err) reject(err);
                else resolve();
            });
        })
    }

    static ProcessarAceitar(denuncia : IDenuncia) : Promise<void>{
        return new Promise((resolve, reject) => {
            global.db.query(
                `UPDATE DENUNCIA
                 SET ACEITA = 1
                 WHERE  USUARIO_MATRICULA = ? AND 
                    AVALIACAO_USUARIO_MATRICULA = ? AND 
                    AVALIACAO_TURMA_PERIODO_CODIGO = ? AND 
                    AVALIACAO_TURMA_DISCIPLINA_CODIGO = ? AND 
                    AVALIACAO_TURMA_CODIGO = ?`,
            [   denuncia.usuario.matricula, 
                denuncia.avaliacao.usuario.matricula, 
                denuncia.avaliacao.turma.periodo.codigo,
                denuncia.avaliacao.turma.disciplina.codigo, 
                denuncia.avaliacao.turma.codigo
            ], (err, result) => {
                if (err) reject(err);
                else {
                    global.db.query(
                        `UPDATE AVALIACAO
                        SET ATIVO = 0
                        WHERE USUARIO_MATRICULA = ? AND 
                            TURMA_PERIODO_CODIGO = ? AND 
                            TURMA_DISCIPLINA_CODIGO = ? AND 
                            TURMA_CODIGO = ?;`,
                    [   denuncia.avaliacao.usuario.matricula, 
                        denuncia.avaliacao.turma.periodo.codigo,
                        denuncia.avaliacao.turma.disciplina.codigo, 
                        denuncia.avaliacao.turma.codigo
                    ], (err, result) => {
                        if (err) reject(err);
                        else resolve();
                    });
                }
            });
        })
    }

    static ProcessarExpulsar(denuncia : IDenuncia) : Promise<void>{
        return new Promise((resolve, reject) => {
            global.db.query(
                `UPDATE DENUNCIA
                 SET ACEITA = 1
                 WHERE  AVALIACAO_USUARIO_MATRICULA = ?`,
            [   denuncia.avaliacao.usuario.matricula
            ], (err, result) => {
                if (err) reject(err);
                else {
                    global.db.query(
                        `UPDATE AVALIACAO
                        SET ATIVO = 0
                        WHERE USUARIO_MATRICULA = ?;`,
                    [   denuncia.avaliacao.usuario.matricula
                    ], (err, result) => {
                        if (err) reject(err);
                        else {
                            global.db.query(
                                `UPDATE USUARIO
                                SET ATIVO = 0
                                WHERE MATRICULA = ?;`,
                            [   denuncia.avaliacao.usuario.matricula
                            ], (err, result) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        }
                    });
                }
            });
        })
    }
}