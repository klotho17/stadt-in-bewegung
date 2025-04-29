// app/your-page/page.js
'use client'; // Needed since we're using useEffect and client-side features

import { fetchAllTitles } from './utils/jsonDataFetcher';
import { useEffect, useState } from 'react';

export default function JsonDataPage() {
  const [titles, setTitles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllTitles();
        setTitles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">JSON Data Viewer</h1>
      <ul className="space-y-2">
        {titles?.regularItems.map((item, index) => (
          <li key={index} className="p-2 border rounded">
            File {item.fileNumber}: {item.title} (ID: {item.id})
          </li>
        ))}
        {titles?.customItems.map((item, index) => (
          <li key={`custom-${index}`} className="p-2 border rounded bg-yellow-50">
            File {item.fileNumber}: {item.title} (Custom Title)
          </li>
        ))}
      </ul>
    </div>
  );
}