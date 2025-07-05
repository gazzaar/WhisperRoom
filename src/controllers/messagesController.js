import { body, validationResult } from 'express-validator';
import { addMessage } from '../models/messagesQueries.js';

const validateMessage = [
  body('title').trim().notEmpty().withMessage('Title should not be empty'),
  body('message_text')
    .trim()
    .notEmpty()
    .withMessage('Message should not be empty'),
];

export const addNewMessage = [
  validateMessage,
  async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('login');
    }

    if (!req.user.is_member) {
      return res.render('login', {
        errors: [{ msg: 'You are not a member' }],
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('create-message', {
        errors: errors.array(),
      });
    }

    const messageDate = new Date(Date.now())
      .toISOString()
      .replace('T', ' ')
      .split('.')[0];
    // Example output: "2025-07-05 16:32:31"
    const { title: messageTitle, message_text: messageText } = req.body;
    console.log(messageTitle, messageText);
    try {
      await addMessage(messageTitle, messageDate, messageText, req.user.id);
      res.render('login-success');
    } catch (err) {
      console.error(err);
    }
  },
];
