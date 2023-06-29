import passport from "passport";
import { IUsuario, RepositorioUsuario } from "../ModelsAndRepo/usuario.js";

global.app.post("/usuario/tornarAdministrador", passport.authenticate('jwt',{session: false}), (req, res, next) => {
    const usuario : IUsuario = req.body;
    if(!req.user.administrador)
        return res.status(403).json({error:'somente administradores podem tornar usuários administradores'});
    RepositorioUsuario.TornarAdministrador(usuario.matricula)
    .then( () => {
        return res.status(200).json({message:"Usuário agora é administrador"});
    })
    .catch(err => { 
            console.log(err);
            return res.status(500).json({error:'Ocorreu um erro'});
    });
});