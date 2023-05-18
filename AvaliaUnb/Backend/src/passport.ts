import passport from 'passport';
import mysql from 'mysql';
import passportJwt, { ExtractJwt } from 'passport-jwt';
import Usuario from './Models/Usuario.js'

export const Passport = () =>{
    const JwtStrategy = passportJwt.Strategy;
    const extractJwt = passportJwt.ExtractJwt;

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'BancosDeDados2023'
    }, (jwtPayload, done) => {
        return Usuario.Get(jwtPayload.sub)
        .then( user => done(null, user))
        .catch(err => done(err))
    }))
}