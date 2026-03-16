import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose'
import cors from 'cors';

// Importing ussd route
import ussdHandler from "./ussd/handler.js";

// importing API routes
import sessionsRoutes from "./routes/sessions.js";
import alertsRoutes from "./routes/alerts.js";
import facilitiesRoutes from "./routes/facilities.js";
import statsRoute from "./routes/stats.js";
import whatsappRoutes from "./routes/whatsapp.js";

const app = express();

// middleware

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}));

// Connecting to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfuly'))
  .catch((err) => console.error('MongoDB coonection error', err))

// Health Check
app.get('/health', (req, res) =>{
  res.json({
    status: 'awake',
    db:mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// USSD Routes
app.post ('ussd', ussdHandler);

// API Routes
app.use('/api/sessions',  sessionsRoutes)
app.use('/api/alerts',  alertsRoutes)
app.use('/api/facilities', facilitiesRoutes)
app.use('/api/stats',  statsRoute)
app.use('/api/whatsapp', whatsappRoutes)

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
