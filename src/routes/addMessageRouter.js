import { Router } from 'express';
import { addNewMessage } from '../controllers/messagesController.js';
const addNewMessageRouter = Router();

addNewMessageRouter.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('login');
  } else {
    res.render('create-message');
  }
});
addNewMessageRouter.post('/', addNewMessage);

export default addNewMessageRouter;
