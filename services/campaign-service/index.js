const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { createTables } = require('./src/models/campaignModel');
const campaignRoutes = require('./src/routes/campaignRoutes');

dotenv.config();
createTables();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/campaigns', campaignRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Campaign service running on port ${PORT}`));