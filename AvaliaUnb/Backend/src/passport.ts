import passport from 'passport';
import passportJwt from 'passport-jwt';
import {RepositorioUsuario, IUsuario} from './ModelsAndRepo/usuario.js'
import jwt from 'jsonwebtoken';

const JwtStrategy = passportJwt.Strategy;
const extractJwt = passportJwt.ExtractJwt;

export const genToken = (user : IUsuario) => {
    return jwt.sign({
        iss: 'AvaliaUnb',
        sub: user.matricula,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, 'AvaliaUnb');
} 

passport.use(new JwtStrategy({
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'AvaliaUnb'
}, (jwtPayload, done) => {
    return RepositorioUsuario.Get(jwtPayload.sub)
    .then( user => done(null, user))
    .catch(err => {
        done(err)})
}))