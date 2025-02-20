// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://gabrield5000:Hp31rP08Y7fngzHw@cluster0.rod03.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// DrivingEvent Model
const drivingEventSchema = new mongoose.Schema({
  driverId: String,
  acceleration: Number,
  braking: Number,
  turn: Number,
  isFlagged: Boolean,
  sustainabilityScore: Number,
  timestamp: Date
});

const DrivingEvent = mongoose.model('DrivingEvent', drivingEventSchema);

// Constants for threshold values
const THRESHOLDS = {
  acceleration: 3.0,
  braking: 4.0,
  turn: 2.5
};

// Monitoring endpoint
app.post('/monitor-behavior', async (req, res) => {
  try {
    const { driverId, acceleration, braking, turn, timestamp } = req.body;

    // Check if event should be flagged
    const isFlagged = acceleration > THRESHOLDS.acceleration ||
                     braking > THRESHOLDS.braking ||
                     turn > THRESHOLDS.turn;

    // Calculate sustainability score
    const maxValues = Object.values(THRESHOLDS);
    const currentValues = [acceleration, braking, turn];
    const avgNormalized = currentValues.reduce((sum, val, index) => 
      sum + (val / maxValues[index]), 0) / 3;
    const sustainabilityScore = Math.max(0, Math.min(1, 1 - avgNormalized));

    // Create new driving event
    const drivingEvent = new DrivingEvent({
      driverId,
      acceleration,
      braking,
      turn,
      isFlagged,
      sustainabilityScore,
      timestamp
    });

    await drivingEvent.save();

    res.json({
      driverId,
      acceleration,
      braking,
      turn,
      isFlagged,
      timestamp,
      sustainabilityScore: Number(sustainabilityScore.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});