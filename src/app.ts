import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import httpStatus from 'http-status';
import { toNodeHandler } from "better-auth/node";

import router from './app/routes';
import { auth } from './lib/auth';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';

const app: Application = express();

app.use(helmet());
app.use(morgan('dev'));

app.use(cors({
  origin: [process.env.FRONTEND_URL as string, 'http://localhost:3000'],
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/api/auth/*", toNodeHandler(auth));

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Cooking With Reina API is live!',
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;