#! /usr/bin/env node
import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;
dotenv.config();

const DbUser = process.env.DB_NAME;
const DbPass = process.env.DB_PASS;

const SQL = ` 
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name varchar(50),
    last_name varchar(50),
    username varchar(100) UNIQUE,
    is_member BOOLEAN,
    password varchar(255)
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title varchar(255),
    created_at timestamp,
    message_text TEXT,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);`;

async function main() {
  console.log('seeding...');
  const client = new Client({
    connectionString: `postgresql://${DbUser}:${DbPass}@localhost:5432/membersonly`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
