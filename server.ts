import express from 'express';
import { searchDay, selectSpecial, getDateBounds } from './queries.js';

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

app.get('/range', async (req, res) => {
  try {
    const bounds = await getDateBounds();
    res.json(bounds); 
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/day', async (req, res) => {
  try {
   const date = req.query.date as string;
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }
    const stats = await searchDay(date);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});