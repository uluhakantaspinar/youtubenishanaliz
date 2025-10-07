import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  const [query, setQuery] = useState('CSGO');
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/videos/${query}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setVideos([]);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const chartData = {
    labels: videos.map(v => v.title),
    datasets: [{
      label: 'Video',
      data: videos.map(() => Math.floor(Math.random() * 1000)),
      backgroundColor: 'rgba(75,192,192,0.6)'
    }]
  };

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-4'>YouTube Niþ & Kategori Ýstatistikleri</h1>
      <input
        className='border p-2 mr-2'
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder='Kategori veya oyun ara'
      />
      <button className='bg-blue-500 text-white px-4 py-2' onClick={fetchVideos}>Ara</button>

      <div className='mt-8'>
        {videos.length > 0 && <Bar data={chartData} />}
      </div>

      <div className='mt-8'>
        {videos.map(v => (
          <div key={v.title} className='border p-2 mb-2 flex'>
            <img src={v.thumbnail} className='w-32 mr-4' />
            <div>
              <h2 className='font-bold'>{v.title}</h2>
              <p>{v.channel} | {new Date(v.publishedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
