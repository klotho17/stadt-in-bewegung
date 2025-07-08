'use client';

import { getRecord } from '@/app/api/get-record'; // API-call to fetch a single record
import { fetchImage } from '@/app/utils/imageurl'; // fetch Image from URL
import { fetchVideo } from '../../utils/videourl'; // fetch Video from URL
import { useSearchParams } from 'next/navigation';
import SideNav from '@/app/components/SideNav';
import MissingVideoImage from '@/app/components/MissingVideoImage'; // placeholder for missing video or image

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ObjectPage() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id); 
  const router = useRouter();
  const [videoURL, setVideoURL] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const topicFromQuery = searchParams.get('topic');
  const [showFullAbstract, setShowFullAbstract] = useState(false);

  //extract short fileNumber for Video and Image URL
  //const fileNumber = id.replace(/^.*Sozarch_Vid_V_/, "");
  //console.log("File Number:", fileNumber);

  // Load entry data first
  useEffect(() => {
    async function loadData() {
      const data = await getRecord(decodedId);
      setEntry(data);
      setLoading(false);
    }
    loadData();
  }, [id, router]);

  // Load video and image after entry is loaded
  useEffect(() => {
    if (!entry) return;
    let cancelled = false;
    async function loadMedia() {
      const urlV = await fetchVideo(decodedId);
      if (!cancelled) setVideoURL(urlV);
      const urlI = await fetchImage(decodedId);
      if (!cancelled) setImgURL(urlI);
    }
    loadMedia();
    return () => { cancelled = true; };
  }, [entry, decodedId]);

  // useEffect(() => {
  //   console.log("ID and decoded:", id, decodedId);
  //   async function loadData() {
  //     /* if (!id) {
  //       router.push('/404');
  //       return;
  //     } */
  //     const data = await getRecord(decodedId);
  //     /* if (!data) {
  //       router.push('/404');
  //       return;
  //     } */
  //     setEntry(data);
  //     // Find adjacent entries
  //     //const currentYear = currentEntry.year ? parseInt(currentEntry.year) : null;
  //     //const filtered = data.regularItems.filter(item => item.id !== id);

  //     // Fetch video URL asynchronously and store in state
  //     const urlV = await fetchVideo(decodedId);
  //     setVideoURL(urlV);

  //     // Fetch video URL asynchronously and store in state
  //     const urlI = await fetchImage(decodedId);
  //     setImgURL(urlI);

  //     setLoading(false);
  //   }

  //   loadData();
  // }, [id, router]);

  // --------------------------  Visual Website Return ------------------------------- //

  if (loading) return <div>Loading...</div>;
  if (!entry) return <div>Eintrag nicht gefunden</div>;

  // splitting abstract at [Kap. 1]
  const abstract = entry.abstract || "";
  const marker = "[Kap. 1]";
  const breakIndex = abstract.indexOf(marker);

  let abstractFirst = abstract;
  let abstractRestText = "";

  if (breakIndex !== -1) {
    abstractFirst = abstract.slice(0, breakIndex);
    abstractRestText = abstract.slice(breakIndex);
  }


  // Check if the videoURL is a video file or a placeholder
  const isVideo = typeof videoURL === 'string' && (videoURL.endsWith('.mp4') || videoURL.endsWith('.m4v'));
  console.log("Video Source:", videoURL);
  console.log("Is Video:", isVideo);

  return (
    <div className="object-page">
      <SideNav page="object-page" entry={entry} topic={topicFromQuery} />
      <h1 dangerouslySetInnerHTML={{ __html: entry.title }}></h1>

      <div>
        <div>
          <p>
            <b><span>Jahr:{" "}</span></b>{entry.year || 'N/A'}
          </p>
          <p>
            <b><span>Beteiligte Personen:{" "}</span></b>
            {Array.isArray(entry.creators) ? entry.creators.join('; ') : entry.creators || 'N/A'}
          </p>
        </div>

        {/* Embed video or display placeholder */}
        <div className="media-container">
  {videoURL === null && imgURL === null ? (
    <div style={{ width: 640, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  ) : isVideo ? (
    <video
      controls
      width="640"
      height="360"
      poster={imgURL && imgURL !== "MISSING" ? imgURL : undefined}
      style={{ background: '#000' }}
    >
      <source src={videoURL} type={
        videoURL.endsWith('.mp4') ? 'video/mp4' :
        videoURL.endsWith('.m4v') ? 'video/x-m4v' :
        'video/mp4'
      } />
      Your browser does not support the video tag.
    </video>
  ) : imgURL && imgURL !== "MISSING" ? (
    <img
      src={imgURL}
      alt={entry.title}
      width={640}
      height={360}
      style={{ objectFit: 'cover', background: '#000' }}
    />
  ) : (
    <MissingVideoImage width={640} height={360} />
  )}
</div>
      </div>

      <div>
        <h2>Beschreibung</h2>
        <p>
          <span dangerouslySetInnerHTML={{ __html: abstractFirst }} />
          {!showFullAbstract && abstractRestText && (
            <>
              <br />
              <button
                className="abstract-button"
                onClick={() => setShowFullAbstract(true)}
              >
                Videokapitel anzeigen
              </button>
            </>
          )}
          {showFullAbstract && abstractRestText && (
            <>
              <br />
              <span dangerouslySetInnerHTML={{ __html: abstractRestText }} />
              {" "}
              <button
                className="abstract-button"
                onClick={() => setShowFullAbstract(false)}
              >
                Videokapitel zuklappen
              </button>
            </>
          )}
        </p>
        <h2> memobase id: {entry.id} </h2>
        <h2> Urheber...Copyright</h2>
      </div>
    </div>
  );
}