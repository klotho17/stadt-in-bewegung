'use client';

import { fetchMetadata } from '../../utils/jsonscript';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EntryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState(null);
  const [adjacentEntries, setAdjacentEntries] = useState({
    prevYear: [],
    sameYear: [],
    nextYear: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchMetadata();
      //const currentEntry = data.regularItems.find(item => item.id === id);
      
      const currentEntry = [...data.regularItems, ...data.customItems]
          .find(item => item.id === id);

      if (!currentEntry) {
        router.push('/404');
        return;
      }

      setEntry(currentEntry);

      // Find adjacent entries
      const currentYear = currentEntry.year ? parseInt(currentEntry.year) : null;
      
      const filtered = data.regularItems.filter(item => item.id !== id);
      
      setAdjacentEntries({
        prevYear: currentYear ? 
          filtered.filter(item => item.year && parseInt(item.year) === currentYear - 1) : [],
        sameYear: currentYear ?
          filtered.filter(item => item.year && parseInt(item.year) === currentYear) : [],
        nextYear: currentYear ?
          filtered.filter(item => item.year && parseInt(item.year) === currentYear + 1) : []
      });

      setLoading(false);
    }

    loadData();
  }, [id, router]);

  if (loading) return <div>Loading...</div>;
  if (!entry) return <div>Eintrag nicht gefunden</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{entry.title}</h1>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h2 className="font-semibold">Datei</h2>
            <p>{entry.fileNumber}</p>
          </div>
          <div>
            <h2 className="font-semibold">Jahr</h2>
            <p>{entry.year || 'N/A'}</p>
          </div>
          {entry.topic?.length > 0 && (
            <div className="col-span-2">
              <h2 className="font-semibold">Themen</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                {entry.topic.map(topic => (
                  <Link 
                    key={topic} 
                    href={`/themen/${encodeURIComponent(topic)}`}
                    className="px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Add more entry details as needed */}
      </div>

      {/* Adjacent entries navigation */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Verwandte Einträge</h2>
        
        {entry.year && (
          <>
            {adjacentEntries.prevYear.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-2">Aus dem Vorjahr ({parseInt(entry.year) - 1})</h3>
                <ul className="space-y-2">
                  {adjacentEntries.prevYear.map(item => (
                    <li key={item.id}>
                      <Link 
                        href={`/objekt/${item.id}`}
                        className="block p-2 border rounded hover:bg-gray-50"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {adjacentEntries.sameYear.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-2">Aus dem gleichen Jahr ({entry.year})</h3>
                <ul className="space-y-2">
                  {adjacentEntries.sameYear.map(item => (
                    <li key={item.id}>
                      <Link 
                        href={`/objekt/${item.id}`}
                        className="block p-2 border rounded hover:bg-gray-50"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {adjacentEntries.nextYear.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-2">Aus dem Folgejahr ({parseInt(entry.year) + 1})</h3>
                <ul className="space-y-2">
                  {adjacentEntries.nextYear.map(item => (
                    <li key={item.id}>
                      <Link 
                        href={`/objekt/${item.id}`}
                        className="block p-2 border rounded hover:bg-gray-50"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}