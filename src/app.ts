import express, { Application, Request, Response } from 'express';
import userRouter from './routes/userRouter';

const app: Application = express();
const port = 3000;

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello express');
});

// JSON 파싱 미들웨어 등록
app.use(express.json());

app.use('/api/user', userRouter);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
