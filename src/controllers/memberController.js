import { body, validationResult } from 'express-validator';
import bcrypt, { hash } from 'bcryptjs';
import { addMember, getMember } from '../models/memberQueries.js';

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
  ,
];

const validateLogin = [
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  ,
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
      const result = await addMember(
        firstName,
        lastName,
        email,
        hashedPassword,
      );

      res.redirect('/login');
    } catch (err) {
      console.error('Error');
    }
  },
];

export const loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await getMember(email);
    const match = await bcrypt.compare(password, result.password);
    if (!match) {
      return res.status(400).render('login', {
        errors: [{ msg: "password dosn't match" }],
      });
    }
    res.send('success loged in');
    res.end();
  } catch (err) {
    console.error(`Error login ${err}`);
  }
};
