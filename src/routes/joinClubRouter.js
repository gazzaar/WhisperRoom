import { Router } from 'express';
import { joinClub } from '../controllers/memberController.js';

const joinClubRouter = Router();

joinClubRouter.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('login');
  }
  res.render('join-club', {
    currentUser: req.user,
  });
});

joinClubRouter.post('/', joinClub);

export default joinClubRouter;
