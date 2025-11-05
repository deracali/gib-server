import express from 'express';
import { createGroup, getGroups } from '../controllers/groupcontroller.js';
const groupRoutes = express.Router();

groupRoutes.post('/create', createGroup);
groupRoutes.get('/get', getGroups);

export default groupRoutes;
