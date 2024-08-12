const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const router = express.Router();

const publicDir = path.join(__dirname, './public');
app.use(cors());
app.use(express.json());
app.use(express.static(publicDir));

router.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

router.get('/track', async (req, res) => {
    const { awb, courier } = req.query;
    const url = `https://api.binderbyte.com/v1/track?api_key=${process.env.API_KEY}&courier=${courier}&awb=${awb}`;

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Terjadi Kesalahan, silakan coba beberapa saat lagi.' });
    }
});

const basePath = process.env.NODE_ENV === 'production' ? '/.netlify/functions/server' : '/';

app.use(basePath, router);

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app; 
