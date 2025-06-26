import { Router } from 'express';
import { createMember } from '../controllers/memberController.js';
const signUpRouter = Router();

signUpRouter.get('/', (req, res) => {
  res.render('sign-up');
});

signUpRouter.post('/', createMember);

export default signUpRouter;
