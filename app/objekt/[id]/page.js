'use client';
console.log("SingleEntryPage file loaded");
//import { fetchMetadata } from '../../utils/jsonscript';
//import { getCachedData, setCachedData } from '../../utils/cache';
import { fetchVideo } from '../../utils/videourl';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import MissingVideoImage from '@/app/components/MissingVideoImage';
import { getRecord } from '@/app/api/get-record';
import { fetchImage } from '@/app/utils/imageurl';

export default function SingleEntryPage() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id); // solve this nicer later maybe
  const router = useRouter();
  const [videoURL, setVideoURL] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adjacentEntries, setAdjacentEntries] = useState({
    prevYear: [],
    sameYear: [],
    nextYear: []
  });

  //extract short fileNumber for Video and Image URL
  //const fileNumber = id.replace(/^.*Sozarch_Vid_V_/, "");
  //console.log("File Number:", fileNumber);

  useEffect(() => {
    console.log("ID and decoded:", id, decodedId);
    async function loadData() {
      /* if (!id) {
        router.push('/404');
        return;
      } */
      const data = await getRecord(decodedId); // Pass the full id to getRecord
      /* if (!data) {
        router.push('/404');
        return;
      } */
      setEntry(data);
      // Find adjacent entries
      //const currentYear = currentEntry.year ? parseInt(currentEntry.year) : null;
      //const filtered = data.regularItems.filter(item => item.id !== id);
      
      /*
      setAdjacentEntries({
        prevYear: currentYear ? 
          filtered.filter(item => item.year && parseInt(item.year) === currentYear - 1) : [],
        sameYear: currentYear ?
          filtered.filter(item => item.year && parseInt(item.year) === currentYear) : [],
        nextYear: currentYear ?
          filtered.filter(item => item.year && parseInt(item.year) === currentYear + 1) : []
      });
      */

      // Fetch video URL asynchronously and store in state
      const urlV = await fetchVideo(decodedId);
      setVideoURL(urlV);

      // Fetch video URL asynchronously and store in state
      const urlI = await fetchImage(decodedId);
      setImgURL(urlI);

      setLoading(false);
    }

    loadData();
  }, [id, router]);

  if (loading) return <div>Loading...</div>;
  if (!entry) return <div>Eintrag nicht gefunden</div>;

  // Check if the videoURL is a video file or a placeholder
  const isVideo = typeof videoURL === 'string' && (videoURL.endsWith('.mp4') || videoURL.endsWith('.m4v'));
  console.log("Video Source:", videoURL);
  console.log("Is Video:", isVideo);

  return (
    <div>
      <h1>{entry.title}</h1>
      <div>
        <div>
          <div>
            <h2>---Datei---:</h2>
            <p>{entry.id}</p>
          </div>
          <div>
            <h2>Jahr:</h2>
            <p>{entry.year || 'N/A'}</p>
          </div>
          {entry.topic?.length > 0 && (
            <div>
              <h2>Themen</h2>
              <div>
                {entry.topic.map(topic => (
                  <Link key={topic} href={`/themen/${encodeURIComponent(topic)}`}>
                    {topic},
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Embed video still image or display placeholder */}
        <div className="image-container">
          {imgURL ? (
          <img
            src={imgURL}
            alt={entry.title}
            width={640}
            height={360}
            className="object-cover"
          />
) : (
  <MissingVideoImage width={640} height={360} />
)}
        </div>
        {/* Embed video or display placeholder */}
        <div className="media-container">
          {isVideo ? (
            <video controls width="640" height="360">
              <source
                src={videoURL}
                type={
                  videoURL.endsWith('.mp4') ? 'video/mp4' : 
                  videoURL.endsWith('.m4v') ? 'video/x-m4v' : 
                  'video/mp4' // default
                } 
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <MissingVideoImage width={640} height={360} />
          )}
        </div>

        {/* Add more entry details as needed */}
      </div>

      <div>
        <h2>Abstract</h2>
        <p>{entry.abstract || 'N/A'}</p>
      </div>

      {/* Adjacent entries navigation */}
      <div>
        <h2>Verwandte Einträge - löschen dafür credits und zurück</h2>
        
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