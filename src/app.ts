import express, { Application, Request, Response } from 'express';
const cors = require('cors');
import {
  userRouter,
  storeRouter,
  homeRouter,
  reservationRouter,
} from './routes/index';

const app: Application = express();
const port = process.env.PORT || 3000;

// 모든 도메인에서의 API 요청을 허용하도록 설정
app.use(
  cors({
    origin: '*',
  })
);

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello express');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRouter);
app.use('/api/stores', storeRouter);
app.use('/api/reserve', reservationRouter);

app.use('/api/home', homeRouter);
//app.use('/api/place', placeRouter);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
