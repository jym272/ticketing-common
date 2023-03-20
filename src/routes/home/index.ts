import { Router } from 'express';
import { getHomeController } from '@controllers/home';

export const home = Router();

home.get('/', getHomeController);
