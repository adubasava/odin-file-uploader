const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { findUserByEmail, findUserById } = require('../prisma/queries');

const strategy = new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const user = await findUserByEmail(email);

      if (!user) {
        return done(null, false, { message: 'Wrong email!' });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: 'Incorrect password!' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
