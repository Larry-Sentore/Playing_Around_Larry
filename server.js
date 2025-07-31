import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Serve your frontend files (optional, or use another method)
app.use(express.static('public'));

// Create an endpoint that sends the API key
app.get('/api/key', (req, res) => {
  res.json({ apiKey: process.env.X_RAPIDAPI_KEY });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
