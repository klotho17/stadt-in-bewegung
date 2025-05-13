'use client';

import { fetchMetadata } from '../../utils/jsonscript';
import { getCachedData, setCachedData } from '../../utils/cache';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SingleEntryPage() {
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
      let data = getCachedData();
      if (!data) {
        console.log("Fetching data...");
        data = await fetchMetadata();
        setCachedData(data);
      } else {
      console.log("Using cached data...");
      }
      
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
      
/*       setAdjacentEntries({
        prevYear: currentYear ? 
          filtered.filter(item => item.year && parseInt(item.year) === currentYear - 1) : [],
        sameYear: currentYear ?
          filtered.filter(item => item.year && parseInt(item.year) === currentYear) : [],
        nextYear: currentYear ?
          filtered.filter(item => item.year && parseInt(item.year) === currentYear + 1) : []
      }); */

      setLoading(false);
    }

    loadData();
  }, [id, router]);

  if (loading) return <div>Loading...</div>;
  if (!entry) return <div>Eintrag nicht gefunden</div>;

  // Check if the videoURL is a video file or a placeholder
  const isVideo = entry.videoURL?.endsWith('.mp4') || entry.videoURL?.endsWith('.m4v');

  return (
    <div>
      <h1>{entry.title}</h1>
      
      <div>
        <div>
          <div>
            <h2>Datei</h2>
            <p>{entry.fileNumber}</p>
          </div>
          <div>
            <h2>Jahr</h2>
            <p>{entry.year || 'N/A'}</p>
          </div>
          {entry.topic?.length > 0 && (
            <div>
              <h2>Themen</h2>
              <div>
                {entry.topic.map(topic => (
                  <Link key={topic} href={`/themen/${encodeURIComponent(topic)}`}>
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Embed video or display placeholder */}
        <div className="media-container">
        {isVideo ? (
          <video 
          controls 
          width="640" 
          height="360"
          onError={(e) => {
        // Fallback to image if video fails to load
        isVideo(false);
        }}
      >
      <source 
        src={entry.videoURL} 
        type={
          entry.videoURL.endsWith('.mp4') ? 'video/mp4' : 
          entry.videoURL.endsWith('.m4v') ? 'video/x-m4v' : 
          'video/mp4' // default
        } 
      />
      Your browser does not support the video tag.
    </video>
    ) : (
    <Image
      src={entry.videoURL}
      alt="Placeholder for unavailable video"
      width="640"
      height="360"
      onError={(e) => {
        // Fallback to a guaranteed placeholder if the image fails
        e.target.src = "https://upload.wikimedia.org/wikipedia/commons/c/c7/ISO_7010_P029.svg";
        }}
    />
    )}
  </div>

        {/* Add more entry details as needed */}
      </div>

      {/* Adjacent entries navigation */}
      <div>
        <h2>Verwandte Einträge</h2>
        
        {entry.year && (
          <>
            {adjacentEntries.prevYear.length > 0 && (
              <div>
                <h3>Aus dem Vorjahr ({parseInt(entry.year) - 1})</h3>
                <ul>
                  {adjacentEntries.prevYear.map(item => (
                    <li key={item.id}>
                      <Link 
                        href={`/objekt/${item.id}`}>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {adjacentEntries.sameYear.length > 0 && (
              <div>
                <h3>Aus dem gleichen Jahr ({entry.year})</h3>
                <ul>
                  {adjacentEntries.sameYear.map(item => (
                    <li key={item.id}>
                      <Link href={`/objekt/${item.id}`}>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {adjacentEntries.nextYear.length > 0 && (
              <div>
                <h3>Aus dem Folgejahr ({parseInt(entry.year) + 1})</h3>
                <ul>
                  {adjacentEntries.nextYear.map(item => (
                    <li key={item.id}>
                      <Link href={`/objekt/${item.id}`}>
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