import express from 'express';
import { getMessages, createMessage } from '../controllers/messagecontroller.js';
const chatRoutes = express.Router();

chatRoutes.get('/:groupId', getMessages);
chatRoutes.post('/', createMessage);

export default chatRoutes;
