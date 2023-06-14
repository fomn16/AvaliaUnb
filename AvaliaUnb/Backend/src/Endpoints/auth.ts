
import {genToken} from '../passport.js'
import bcrypt from 'bcrypt'
import {RepositorioUsuario, IUsuario} from "../ModelsAndRepo/usuario.js";

global.app.post('/auth/register', async (req, res, next) => {
    const novoUsuario : IUsuario = req.body;
    if (!novoUsuario)
        return res.status(403).json({error:'dados inválidos'})

    return RepositorioUsuario.Get(novoUsuario.matricula)
    .then(usuarioExiste =>{
        if(usuarioExiste)
            return res.status(403).json({error:'matrícula já cadastrada'});

        return RepositorioUsuario.Save(novoUsuario)
        .then(usuarioBd => {
            const token = genToken(usuarioBd);
            return res.status(200).json({token});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error:'erro ao cadastrar usuario'});
        });
    });
})

global.app.post('/auth/login', async (req, res, next) => {
    const credenciais : IUsuario = req.body;
    if (!credenciais)
        return res.status(403).json({error:'dados inválidos'})

    return RepositorioUsuario.Get(credenciais.matricula).then(usuario => {
        if(!usuario)
            return res.status(403).json({error:'matrícula ou senha errada'});
        
        bcrypt.compare(credenciais.senha + usuario.salt, usuario.senha, (err, result) => {
            if(err) return res.status(500).json({error:'erro ao recuperar usuario'});
            if (result) {
                const token = genToken(usuario);
                return res.status(200).json({token});
            }
            return res.status(403).json({error:'matrícula ou senha errada'});
        });        
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error:'erro ao recuperar usuario'});
    });
})