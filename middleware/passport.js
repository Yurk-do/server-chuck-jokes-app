const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const secretKey = 'yurk-do';
const db = require('../database/index');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        db.users.find({ _id: payload.id }, (error, users) => {
          if (users.length) {
            const user = {
              username: users[0].username,
              password: users[0].password,
            };
            done(null, user);
            console.log('++++++++++++++++++',user)
          } else {
            done(null, false);
          }
        });
      } catch (error) {
        console.log(error);
      }
    })
  );
};
