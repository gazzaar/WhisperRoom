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

app.get('/', (req, res) => {
  if (req.session.viewCount) {
    req.session.viewCount++;
  } else {
    req.session.viewCount = 1;
  }
  res.send(`hello world, you viewed our page ${req.session.viewCount} times!`);

  res.end();
});

app.use('/login', loginRouter);
app.use('/sign-up', signUpRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server started at port: ${PORT} `);
});
