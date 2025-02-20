# Welcome Driving Behavior Monitor Back-end👋

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the backend 

   ```bash
    npm start
   ```
## explanation of the back-end code and design choices:

### Threshold Values and Constants
```javascript
const THRESHOLDS = {
  acceleration: 3.0,  // Maximum acceptable acceleration (m/s²)
  braking: 4.0,      // Maximum acceptable braking force (m/s²)
  turn: 2.5          // Maximum acceptable turning force (m/s²)
};
```
These thresholds define the acceptable limits for driving behavior. When exceeded, the event is flagged as potentially unsafe.

### Data Model Structure
```javascript
const drivingEventSchema = new mongoose.Schema({
  driverId: String,           // 9-digit unique identifier
  acceleration: Number,        // Acceleration measurement
  braking: Number,            // Braking force measurement
  turn: Number,               // Turning force measurement
  isFlagged: Boolean,         // Indicates if thresholds were exceeded
  sustainabilityScore: Number, // 0-1 score of driving efficiency
  timestamp: Date             // When the event occurred
});
```

### Key Design Choices:

1. **Event Flagging**:
```javascript
const isFlagged = acceleration > THRESHOLDS.acceleration ||
                 braking > THRESHOLDS.braking ||
                 turn > THRESHOLDS.turn;
```
- Simple boolean logic to identify unsafe driving patterns
- Any measurement exceeding its threshold triggers a flag

2. **Sustainability Score Calculation**:
```javascript
   const avgNormalized = currentValues.reduce((sum, val, index) => 
  sum + (val / maxValues[index]), 0) / 3;
   const sustainabilityScore = Math.max(0, Math.min(1, 1 - avgNormalized));
```
- Normalizes measurements against thresholds
- Produces a score between 0-1 (1 being most sustainable)
- Inverse relationship: higher measurements = lower score

3. **Error Handling**:
```javascript
try {
  // ... operation code ...
} catch (error) {
  res.status(500).json({ error: 'Internal server error' });
}
```
- Robust error handling for database operations
- Returns appropriate HTTP status codes

4. **Data Persistence**:
- Uses MongoDB for flexible document storage
- Schema validation ensures data integrity
- Timestamp tracking for historical analysis

This implementation provides a balanced approach between performance monitoring and data collection while maintaining simplicity in the scoring system.
