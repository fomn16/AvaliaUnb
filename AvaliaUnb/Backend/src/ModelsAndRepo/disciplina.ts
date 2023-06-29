import {IDepartamento} from './departamento.js'

export interface IDisciplina{
    codigo? : number;
    codigoTxt? : string;
    departamento? : IDepartamento;
    nome? : string;
}