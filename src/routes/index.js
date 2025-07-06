import { Router } from 'express';
import { getAllMessages } from '../controllers/messagesController.js';
const indexRouter = Router();

indexRouter.get('/', getAllMessages);

export default indexRouter;
