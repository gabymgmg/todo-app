const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('./models/index');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
// module.exports = {
//     init: () =>
//         passport.use(
//             new JwtStrategy(options, (jwtPayload, done) => {
//                 // Use the decoded user ID (jwtPaysload.id) to fetch user data from your database
//                 db.User.findOne({ where: { id: jwtPayload.id } })
//                     .then(user => {
//                         if (user) {
//                             return done(null, user); // Successful verification
//                         } else {
//                             return done(null, false); // User not found
//                         }
//                     })
//                     .catch(error => {
//                         console.error('Error finding user by ID:', error);
//                         return done(error); // Internal server error
//                     });
//             })
//         )
//         passport.serializeUser((user, done) => {;
//             done(null, user.id);
//           });



// }


module.exports = {
    init: () => {
        passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await db.User.findOne({ where: { email } });
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password' });
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }));
        passport.use('jwt', new JwtStrategy(options, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch(err => done(err, null));
        }));
        passport.serializeUser((user, done) => {
            ;
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
        res.redirect('/login?next=' + req.url);
    }
};




