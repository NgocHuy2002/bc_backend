const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;


require('dotenv').config();

const corsOptions = {
  origin: '*',
};
// Middleware for parsing JSON requests
app.use(express.json());
app.use(cors(corsOptions));

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/users', require('./routes/user'));
app.use('/api/company', require('./routes/company'));
app.use('/api/product', require('./routes/product'));
app.use('/api/contracts', require('./routes/contract'));
app.use('/api/images', require('./routes/image'));
app.use('/api/public', require('./routes/public_contract'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
