import mysql from 'mysql';

export default class Usuario{
    matricula : number;
    senha: number;
    salt: number;

    static Get = (matricula:number): Promise<Usuario | undefined> => {
        return new Promise((resolve, reject) => {
            global.db.query("SELECT * FROM USUARIO WHERE MATRICULA = ?", [matricula], function (err, result) {
                if (err) reject(err);
                if(result.length == 0) resolve(undefined);
                var u = result[0];
                resolve({ matricula: u.MATRICULA, senha:u.SENHA_HASH, salt: u.SENHA_SALT});
            });
        });
    }
}