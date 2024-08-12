require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/track', async (req, res) => {
    // Mendapatkan awb dan courier dari query parameters
    const { awb, courier } = req.query;

    const url = `https://api.binderbyte.com/v1/track?api_key=${process.env.API_KEY}&courier=${courier}&awb=${awb}`;

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan, silakan coba lagi.' });
    }
});

if (process.env.NETLIFY) {
    const serverless = require('serverless-http');
    module.exports.handler = serverless(app);
} else {
    app.listen(port, () => {
        console.log('API_KEY:', process.env.API_KEY);
        console.log(`Server berjalan di http://localhost:${port}`);
    });
}