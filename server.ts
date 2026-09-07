import express from 'express';
import { searchDay, selectSpecial } from './queries.js';

const app = express();
const PORT = 3000;

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
    const stats = await searchDay("2024-10-01");
    res.json(stats);
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});