import express from 'express';
import cors from 'cors';
import karigarsRouter from './routes/karigars';
import assignmentsRouter from './routes/assignment';
import ordersRouter from './routes/order';
import { errorHandler } from './utils/errorHandlers';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/karigars', karigarsRouter);
app.use('/assignments', assignmentsRouter);
app.use('/orders', ordersRouter);

app.use(errorHandler);

export default app;
