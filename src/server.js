import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'views')));
// app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.send('hello world');
  res.end();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('server started ');
});
