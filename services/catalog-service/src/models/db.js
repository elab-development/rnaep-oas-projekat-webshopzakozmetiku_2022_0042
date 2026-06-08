const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB povezan uspesno');
  } catch (error) {
    console.error('Greska pri povezivanju na MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;