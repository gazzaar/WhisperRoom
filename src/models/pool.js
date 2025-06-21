import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
dotenv.config();

const DbUser = process.env.DB_NAME;
const DbPass = process.env.DB_PASS;

export default new Pool({
  host: 'localhost',
  user: DbUser,
  database: 'membersonly',
  password: DbPass,
  port: 5432,
});
