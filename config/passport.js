const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

let options = {};

options.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.SECRET;

module.exports = (passport) =>{
    passport.use(new jwtStrategy(options, function (jwt_payload, done) {
        User.findById(jwt_payload.id)
            .then(user =>{
                if (user){
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err=>{
                return done(err,false);
            })
    }))
};
