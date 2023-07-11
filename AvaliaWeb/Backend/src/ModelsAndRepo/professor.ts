import { IDepartamento } from "./departamento.js";

export interface IProfessor{
    codigo?: number;
    nome?: string;
    departamento?: IDepartamento;
}

export interface IProfessorFilter{
    codigo?: number;
}