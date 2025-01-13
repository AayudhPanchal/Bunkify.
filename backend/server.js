const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./utils/db');
const subjectRoutes = require('./routes/subjectRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173', 
  'https://bunkify-frontend.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());

app.use('/api/subjects', subjectRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});