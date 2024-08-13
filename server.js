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
    const { name } = req.query;
    const url = `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(name)}`;

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Character not found');
        }
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const character = data.results[0]; // Assuming we want the first match
            const characterData = {
                name: character.name,
                gender: character.gender,
                status: character.status,
                image: character.image
            };
            res.json(characterData);
        } else {
            res.status(404).json({ error: 'Karakter tidak ditemukan.' });
        }
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

module
