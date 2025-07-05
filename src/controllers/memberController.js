import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import passport from '../config/passport.js';
import { addMember, updateMembership } from '../models/memberQueries.js';

dotenv.config();
const alphaErr = 'must only contain letters.';
const lengthErr = 'must be between 1 and 10 characters.';

const validateSignUp = [
  body('firstName')
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body('lastName')
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const validateJoin = [
  body('passcode').trim().notEmpty().withMessage('passcode is required'),
];

export const createMember = [
  validateSignUp,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render('sign-up', {
          errors: errors.array(),
        });
      }
      const { firstName, lastName, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await addMember(firstName, lastName, email, hashedPassword);
      res.redirect('/login');
    } catch (err) {
      console.error('Error creating member:', err);
      res.status(500).render('sign-up', {
        errors: [{ msg: 'Server error, please try again later' }],
      });
    }
  },
];

export const loginMember = [
  validateLogin,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('login', {
        errors: errors.array(),
      });
    }
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        // Store the error message in session
        req.session.messages = info.message;
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/login');
      });
    })(req, res, next);
  },
];

export const joinClub = [
  validateJoin,
  async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.redirect('login');
      }

      if (req.user.is_member) {
        return res.render('join-club', {
          errors: [{ msg: 'Your are already a member' }],
        });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render('join-club', {
          errors: errors.array(),
        });
      }
      const { passcode } = req.body;
      if (passcode !== process.env.SECRET_PASSCODE) {
        return res.status(400).render('join-club', {
          errors: [{ msg: 'Invalid passcode' }],
        });
      }

      const updatedUser = await updateMembership(req.user.id);
      req.login(updatedUser, (err) => {
        if (err) {
          console.error(`Error updating session: ${err}`);
          return res.status(500).render('join-club', {
            errors: [{ msg: 'Server Error please try again later' }],
          });
        }
        res.redirect('login');
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('join-club', {
        errors: [{ msg: 'Server error, please try again later' }],
      });
    }
  },
];
