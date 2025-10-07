const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const YT_API_KEY = process.env.YT_API_KEY;

// Endpoint: Oyun kategorisindeki bir alt kategori (örnek: CSGO) videolarýný çek
app.get('/api/videos/:query', async (req, res) => {
  const query = req.params.query;
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: YT_API_KEY,
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults: 10
      }
    });

    const videos = response.data.items.map(item => ({
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.medium.url
    }));

    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).send('YouTube API error');
  }
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
