import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Initialize MongoDB connection asynchronously
connectDB();

app.listen(PORT, () => {
  console.log(`[VELOOP Giveaway API] Server running on port ${PORT}`);
  console.log(`[VELOOP Giveaway API] Health endpoint at http://localhost:${PORT}/health`);
});
