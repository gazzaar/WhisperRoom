import pool from './pool.js';

const addMessage = async (messageTitle, messageText, userID) => {
  try {
    await pool.query(
      'INSERT INTO messages (title, message_text, user_id) VALUES ($1,$2,$3) ',
      [messageTitle, messageText, userID]
    );
  } catch (err) {
    console.error('Error adding message', err);
    throw err;
  }
};

const getMessages = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        m.id,
        m.title,
        m.created_at,
        m.message_text,
        m.user_id,
        u.first_name,
        u.last_name
      FROM messages m 
      JOIN users u ON m.user_id = u.id 
      ORDER BY m.created_at DESC
    `);
    return rows;
  } catch (err) {
    console.error('Error getting messages', err);
    throw err;
  }
};

export { addMessage, getMessages };
