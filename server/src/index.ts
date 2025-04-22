import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { join } from 'path';
import attributesRouter from './routes/attributes';
import type { Express } from 'express';

dotenv.config({ path: join(__dirname, '..', '.env') });

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/attributes', attributesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 