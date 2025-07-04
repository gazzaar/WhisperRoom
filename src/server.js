import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import signUpRouter from './routes/signUp.js';
import loginRouter from './routes/login.js';
import pool from './models/pool.js';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js';

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

app.get('/', (req, res) => {
  res.render('sign-up');
});

app.use('/login', loginRouter);
app.use('/sign-up', signUpRouter);

app.get('/login-success', (req, res) => {
  res.render('login-success');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server started at port: ${PORT} `);
});
