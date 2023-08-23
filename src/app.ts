import express, { Application, Request, Response } from 'express';
import { userRouter, storeRouter, placeRouter } from './routes/index';

const app: Application = express();
const port = 3000;

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello express');
});

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/stores', storeRouter);
app.use('/api/place', placeRouter);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
