import { Request, Response } from 'express';

export const getHomeController = () => {
  return (req: Request, res: Response) => {
    res.send('Hello there!');
  };
};
