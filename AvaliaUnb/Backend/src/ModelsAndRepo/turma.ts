import {ILocal} from './local.js'
import {IPeriodo} from './periodo.js'
import { IDisciplina } from './disciplina.js';

export interface ITurma{
    codigo? : string;
    periodo? : IPeriodo;
    disciplina? : IDisciplina;
    vagasOcupadas? : number;
    totalVagas? : number;
    local? : ILocal;
    turno? : string;
}