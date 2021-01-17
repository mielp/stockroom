import { Express, RequestHandler } from 'express';

const log: RequestHandler = async (req, res) => {
  res.status(200).json({ example: 'hi!' });
};

export function setup(app: Express): void {
  app.get('/test', log);
}
