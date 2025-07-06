import { body, validationResult } from 'express-validator';
import { addMessage, getMessages } from '../models/messagesQueries.js';

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

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
      return res.render('join-club', {
        errors: [{ msg: 'You are not a member' }],
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('create-message', {
        errors: errors.array(),
      });
    }

    const { title: messageTitle, message_text: messageText } = req.body;
    try {
      await addMessage(messageTitle, messageText, req.user.id);
      res.redirect('/');
    } catch (err) {
      console.error(err);
    }
  },
];

export const getAllMessages = async (req, res) => {
  try {
    const result = await getMessages();

    // If user is not authenticated or not a member, remove user names
    const messages = result.map((message) => {
      if (!req.isAuthenticated() || !req.user.is_member) {
        const { first_name, last_name, ...messageWithoutName } = message;
        return messageWithoutName;
      }
      return message;
    });

    res.render('index', {
      messages: messages,
      formatDate: formatDate,
      currentUser: req.user,
    });
  } catch (err) {
    console.error(err);
  }
};
