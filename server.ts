import express from 'express';
import cors from 'cors';
import { searchDay, selectSpecial } from './queries.js';

const app = express();
const PORT = 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.get('/', async (req, res) => {
  try {
    const stats = await selectSpecial();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/day', async (req, res) => {
 try {
    const date = req.query.date;
    if (!date || typeof date !== 'string') {
      return res.json([]);
    }
    const stats = await searchDay(date);
    return res.json(stats || []);
  } catch (error) {
    console.error('Handled backend error in /day:', error);
    
    return res.json([]);
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});