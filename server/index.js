import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const { default: connectDB } = await import('./db.js');
const { default: authRoutes } = await import('./routes/auth.js');



const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(cors({
  origin: process.env.CLIENT_URL || 'https://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
