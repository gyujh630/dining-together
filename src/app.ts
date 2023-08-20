import express, { Application, Request, Response } from 'express';
import pool from './config/dbConfig';

const app: Application = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello express');
});

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
