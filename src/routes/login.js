import { Router } from 'express';
import { loginMember } from '../controllers/memberController.js';
const loginRouter = Router();

loginRouter.get('/', (req, res) => {
  res.render('login');
});

loginRouter.post('/', loginMember);

export default loginRouter;
