import passport from 'passport';
import passportJwt from 'passport-jwt';
import {RepositorioUsuario, IUsuario} from './ModelsAndRepo/usuario.js'
import jwt from 'jsonwebtoken';

const JwtStrategy = passportJwt.Strategy;
const extractJwt = passportJwt.ExtractJwt;

export const genToken = (user : IUsuario) => {
    return jwt.sign({
        iss: 'AvaliaWeb',
        sub: user.matricula,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, 'AvaliaWeb');
} 

passport.use(new JwtStrategy({
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'AvaliaWeb'
}, (jwtPayload, done) => {
    return RepositorioUsuario.Get(jwtPayload.sub)
    .then( user => {
        if(user.ativo)
            done(null, user);
        else
            done(null, false, "Usuário perdeu acesso ao sistema.")
    })
    .catch(err => {
        done(err)})
}))