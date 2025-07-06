import bodyParser from 'body-parser';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import './config/passport.js';
import pool from './models/pool.js';
import joinClubRouter from './routes/joinClubRouter.js';
import loginRouter from './routes/login.js';
import signUpRouter from './routes/signUp.js';
import addNewMessageRouter from './routes/addMessageRouter.js';
import indexRouter from './routes/index.js';

const connectPg = connectPgSimple(session);
const sessionStore = new connectPg({
  pool: pool,
  tableName: 'session',
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'views/css')));

// Get current user accross your template
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Setting up session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 Day
    },
  }),
);

app.use(passport.session());

app.use('/', indexRouter);

app.use('/login', loginRouter);
app.use('/sign-up', signUpRouter);
app.use('/join-club', joinClubRouter);
app.use('/create-message', addNewMessageRouter);
app.use('/messages', messagesRouter);

app.get('/login-success', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('login-success', { currentUser: req.user });
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server started at port: ${PORT} `);
});
