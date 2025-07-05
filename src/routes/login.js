import { Router } from 'express';
import { loginMember } from '../controllers/memberController.js';
const loginRouter = Router();

loginRouter.get('/', (req, res) => {
  // Check for passport failure messages
  const errors = req.session.messages ? [{ msg: req.session.messages }] : [];
  // Clear the messages after using them
  delete req.session.messages;

  res.render('login', {
    currentUser: req.user,
    errors: errors,
  });
});

loginRouter.post('/', loginMember);

export default loginRouter;
