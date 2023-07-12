import passport from "passport";
import { ITurma, ITurmaFilter, RepositorioTurma } from "../ModelsAndRepo/turma.js";

global.app.post("/turma/listar", passport.authenticate('jwt',{session: false}), (req, res, next) => {
    const filtroTurma : ITurmaFilter = req.body;
    RepositorioTurma.List(filtroTurma)
    .then( avaliacao => {
        return res.status(200).json(avaliacao);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error:'Erro ao buscar turmas'});
    });
});

global.app.post("/turma/listarProfessores", passport.authenticate('jwt',{session: false}), (req, res, next) => {
    const filtro : ITurma = req.body;
    RepositorioTurma.ListProfessores(filtro)
    .then( professores => {
        return res.status(200).json(professores);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error:'Erro ao buscar turmas'});
    });
});