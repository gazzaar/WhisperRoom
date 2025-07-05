import pool from './pool.js';

const addMessage = async (messageTitle, createdAt, messageText, userID) => {
  try {
    await pool.query(
      'INSERT INTO messages (title,created_at,message_text,user_id) VALUES ($1,$2,$3,$4) ',
      [messageTitle, createdAt, messageText, userID],
    );
  } catch (err) {
    console.error('Error adding message', err);
    throw err;
  }
};

export { addMessage };
