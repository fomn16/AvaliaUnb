import passport from "passport";
import {IAvaliacaoProfessor, RepositorioAvaliacaoProfessor} from '../ModelsAndRepo/avaliacaoProfessor.js';

global.app.delete("/avaliacaoProfessor", passport.authenticate('jwt',{session: false}), (req, res, next) => {
    const avaliacaoProfessor : IAvaliacaoProfessor = req.body;
    avaliacaoProfessor.avaliacao.usuario = req.user;
    RepositorioAvaliacaoProfessor.Delete(avaliacaoProfessor)
    .then( () => {
        return res.status(200).json("Avaliação removida com sucesso");
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error:'Erro ao remover avaliação'});
    });
});