const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

const apiKey = 'ebfe7c3c7e29bf38d2d58eb6b7a5220ae490dd5449f6be4008dfb1866f98adab';

app.use(cors());
app.use(express.json());

// Tentukan path ke direktori 'public'
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Rute untuk root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

app.post('/track', async (req, res) => {
    const { awb, courier } = req.body;
    const url = `https://api.binderbyte.com/v1/track?api_key=${apiKey}&courier=${courier}&awb=${awb}`;

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

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
