import passport  from 'passport';
import fs from 'fs';

//forma manual de adicionar todos os arquivos desse diretório
fs.readdirSync('./dist/Endpoints/').forEach((file) => {
  if (file != "endpoints.js" && file.endsWith('.js')) import('./' + file);
});

//route de teste
global.app.get("/teste", passport.authenticate('jwt',{session: false}), (req, res, next) => {
    global.db.query("select * from departamento", (err, result) => {
        if (err) throw err;
        res.json({...result, user: req.user});
    });
});