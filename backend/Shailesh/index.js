const express = require('express');
const axios = require('axios');
const app = express();

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API server');
});

// API route
app.get('/api', async (req, res) => {
  console.log("Received request at /api endpoint");
  try {
    const response = await axios.get('https://www.nseindia.com/api/option-chain-indices', {
      params: req.query,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Access-Control-Allow-Origin': '*',
      },
      // Set timeout for external API call (adjust as needed)
      timeout: 100000 // milliseconds (default is 10000)
    });
    console.log("Response data received:", response.data);
    res.set('Access-Control-Allow-Origin', '*');
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    // Send a more informative error message
    res.status(500).send({ message: 'Error fetching data. Please try again later.' });
  }
});

// Start the server
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});