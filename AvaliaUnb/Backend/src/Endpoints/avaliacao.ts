import passport from "passport";
import { IAvaliacao, IAvaliacaoFilter, RepositorioAvaliacao} from "../ModelsAndRepo/avaliacao.js";
import { TreatedResponse } from "../ModelsAndRepo/treatedResponse.js";

global.app.post("/avaliacao", passport.authenticate('jwt',{session: false}), (req, res, next) => {
    const novaAvaliacao : IAvaliacao = req.body;
    novaAvaliacao.usuario = req.user;
    RepositorioAvaliacao.Save(novaAvaliacao)
    .then( msg => {
        return res.status(200).json({message:msg});
    })
    .catch(err => { 
        if(err instanceof TreatedResponse){
            return res.status(500).json({error:'Erro ao cadastrar a avaliação: ' + err.treatedMessage});
        }
        else{
            console.log(err);
            return res.status(500).json({error:'Erro ao cadastrar a avaliação'});
        }
    });
});

global.app.get("/avaliacao", passport.authenticate('jwt',{session: false}), (req, res, next) => {
    const filtroAvaliacao : IAvaliacaoFilter = req.body;
    RepositorioAvaliacao.Get(filtroAvaliacao)
    .then( avaliacao => {
        return res.status(200).json(avaliacao);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error:'Erro ao buscar avaliações'});
    });
});

global.app.delete("/avaliacao", passport.authenticate('jwt',{session: false}), (req, res, next) => {
    const avaliacao : IAvaliacao = req.body;
    avaliacao.usuario = req.user;
    RepositorioAvaliacao.Delete(avaliacao)
    .then( () => {
        return res.status(200).json("Avaliação removida com sucesso");
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error:'Erro ao remover avaliação'});
    });
});