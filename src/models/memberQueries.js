import pool from './pool.js';

const addMember = async (firstName, lastName, email, password) => {
  try {
    const result = await pool.query(
      'insert into users(first_name,last_name,email,password) VALUES($1,$2,$3,$4) ',
      [firstName, lastName, email, password],
    );
  } catch (err) {
    console.error(`Error creating Member ${err}`);
  }
};

const getMember = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 ', [
      email,
    ]);
    const member = result.rows[0];

    if (!member) {
      throw new Error('Membernot found');
    }
    return member;
  } catch (err) {
    console.error(`Error getting member ${err}`);
  }
};

export { addMember, getMember };
