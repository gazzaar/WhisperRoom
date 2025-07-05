import pool from './pool.js';

const addMember = async (firstName, lastName, email, password) => {
  try {
    await pool.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, email, password],
    );
  } catch (err) {
    console.error(`Error creating member: ${err}`);
    throw err; // Throw error to be caught by controller
  }
};

const getMember = async (email) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    return rows[0] || null; // Return null if no user found
  } catch (err) {
    console.error(`Error getting member: ${err}`);
    throw err; // Throw error to be caught by Passport
  }
};

const updateMembership = async (userId) => {
  try {
    const { rows } = await pool.query(
      'UPDATE users SET is_member = true WHERE id = $1 RETURNING *',
      [userId],
    );
    return rows[0] || null;
  } catch (err) {
    console.error(`Error Updating member: ${err}`);
    throw err;
  }
};

export { addMember, getMember, updateMembership };
