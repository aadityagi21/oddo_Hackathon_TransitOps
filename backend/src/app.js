import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/errorMiddleware.js';

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/v1', routes);

// ─── Error Handling ───────────────────────────────────────────
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
