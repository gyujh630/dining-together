import express, { Application, Request, Response } from 'express';
import pool from './config/dbConfig';
import storeRouter from './routes/StoreRouter';

const app: Application = express();
const port = 3000;

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello express');
});

app.use('/api/store', storeRouter);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
