import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import signUpRouter from './routes/signUp.js';
import loginRouter from './routes/login.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('hello world');
  res.end();
});

app.use('/login', loginRouter);
app.use('/sign-up', signUpRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server started at port: ${PORT} `);
});
