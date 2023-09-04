import express, { Application, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import {
  userRouter,
  storeRouter,
  homeRouter,
  reservationRouter,
} from './routes/index';

const app: Application = express();
const port = process.env.PORT || 3000;

// 모든 도메인에서의 API 요청을 허용하도록 설정
app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRouter);
app.use('/api/stores', storeRouter);
app.use('/api/reserve', reservationRouter);
app.use('/api/home', homeRouter);

// 먼저 API 라우트 설정을 마친 후 정적 파일을 제공
app.use(express.static(path.join(__dirname, '../client/build')));
app.use('/uploads', express.static('uploads'));

app.get('/api', async (req: Request, res: Response) => {
  res.send('Hello express');
});

app.get('*', async (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
