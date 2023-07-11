import passport from "passport";
import { IDenuncia, RepositorioDenuncia, Operacao, Processo} from "../ModelsAndRepo/denuncia.js";
import { TreatedResponse } from "../ModelsAndRepo/treatedResponse.js";

global.app.post("/denuncia", passport.authenticate('jwt',{session: false}), (req, res, next) => {
    const novaDenuncia : IDenuncia = req.body;
    novaDenuncia.usuario = req.user;
    RepositorioDenuncia.Save(novaDenuncia)
    .then( msg => {
        return res.status(200).json({message:msg});
    })
    .catch(err => { 
        if(err instanceof TreatedResponse){
            return res.status(500).json({error:'Erro ao cadastrar a denúncia: ' + err.treatedMessage});
        }
        else{
            console.log(err);
            return res.status(500).json({error:'Erro ao cadastrar a denúncia'});
        }
    });
});

global.app.get("/denuncia", passport.authenticate('jwt',{session: false}), (req, res, next) => {
    const filtroDenuncia : IDenuncia = req.body;
    RepositorioDenuncia.Get(filtroDenuncia)
    .then( denncia => {
        return res.status(200).json(denncia);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error:'Erro ao buscar denúncias'});
    });
});

global.app.delete("/denuncia", passport.authenticate('jwt',{session: false}), (req, res, next) => {
    const denuncia : IDenuncia = req.body;
    denuncia.usuario = req.user;
    RepositorioDenuncia.Delete(denuncia)
    .then( () => {
        return res.status(200).json("Denúncia removida com sucesso");
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error:'Erro ao remover a denúncia'});
    });
});

global.app.post("/denuncia/processar", passport.authenticate('jwt',{session: false}), (req, res, next) => {
    const processo : Processo = req.body;
    if(!req.user.administrador)
        return res.status(401).json({error:'Apenas administradores podem processar denúncias.'});
    
    RepositorioDenuncia.Get(processo.denuncia)
    .then( d => {
        if(d.length && d[0].aceita)
            return res.status(500).json({error:'Denuncia já processada.'});
        RepositorioDenuncia.Processar(processo)
        .then( () => {
            return res.status(200).json("Denúncia processada com sucesso");
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error:'Erro ao processar a denúncia'});
        });
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error:'Erro ao processar a denúncia'});
    });
});