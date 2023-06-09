import bcrypt from 'bcrypt'
import crypto from 'crypto'

export interface IUsuario{
    matricula? : number;
    email?: string;
    nome?: string;
    senha?: string;
    salt?: string;
    administrador?: boolean;
    ativo?: boolean;
    avatar?: string;
}

export class RepositorioUsuario{
    static Map = ((usuarioRow) : IUsuario => {
        return {
            matricula : usuarioRow.MATRICULA,
            email: usuarioRow.EMAIL,
            nome: usuarioRow.NOME,
            senha: usuarioRow.SENHA_HASH,
            salt: usuarioRow.SENHA_SALT,
            administrador: usuarioRow.ADMINISTRADOR,
            ativo: usuarioRow.ATIVO,
            avatar: usuarioRow.AVATAR.toString('utf8')
        }
    })

    static Get = (matricula:number): Promise<IUsuario | undefined> => {
        return new Promise((resolve, reject) => {
            global.db.query("SELECT * FROM USUARIO WHERE MATRICULA = ?", [matricula], (err, result) => {
                if (err) reject(err);
                else {
                    const usuarioRow = result?.[0];
                    if(usuarioRow) resolve(RepositorioUsuario.Map(usuarioRow))
                    else resolve(undefined);
                }
            });
        });
    }

    static TornarAdministrador = (matricula:number): Promise<void> => {
        return new Promise((resolve, reject) => {
            global.db.query("UPDATE USUARIO SET ADMINISTRADOR = 1 WHERE MATRICULA = ?", [matricula], (err, result) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }


    static Save(usuario : IUsuario) : Promise<IUsuario>{
        return new Promise((resolve, reject) => {
            var salt = crypto.randomBytes(20).toString('hex');
            var saltedPassword = usuario.senha + salt;
            return bcrypt.hash(saltedPassword, 10)
            .then(hash => {
                global.db.query("INSERT INTO USUARIO VALUES(?,?,?,?,?,?,?,?)", 
                [usuario.matricula, usuario.email, usuario.nome, hash, salt , false, true,Buffer.from(usuario.avatar, 'utf8')], (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else resolve({
                        matricula: usuario.matricula, 
                        email: usuario.email, 
                        nome:usuario.nome, 
                        administrador:false,
                        ativo: true,
                        avatar:usuario.avatar
                    })
                });   
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
        })
    }
}