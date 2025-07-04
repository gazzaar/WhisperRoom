import bcrypt from 'bcryptjs';
import passport from 'passport';
import pool from '../models/pool.js';
import LocalStrategy from 'passport-local';
import { getMember } from '../models/memberQueries.js';

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await getMember(email);
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    const user = rows[0];
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
