const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('./models/index');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const messages =  require('./utils/messages')

const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.jwt]), // Extract it from the cookies
    secretOrKey: process.env.JWT_SECRET,
};
module.exports = {
    init: () => {
        passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await db.User.findOne({ where: { email } });
                if (!user) {
                    return done(null, false, { message: messages.USER_NOT_FOUND});
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: messages.INCORRECT_PASSWORD});
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }));
        passport.use('jwt', new JwtStrategy(options, (jwt_payload, done) => {
            db.User.findByPk(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false);
                    }
                })
                .catch(err => done(err, null));
        }));
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser(async (id, done) => {
            const user = await db.User.findOne({ where: { id } });
            done(null, user);
        });

    },
    protectRoute: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }
};




