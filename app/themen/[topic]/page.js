'use client';

import { getRecordList } from '@/app/api/get-record-list'; // API-call to fetch records of a specific topic
import { fetchImage } from '@/app/utils/imageurl';
import { fetchVideo } from '@/app/utils/videourl';
import SideNav from '@/app/components/SideNav';
// placeholder for missing video or image not used on this page
// because custom items can't be total hit
import MissingVideoImage from '@/app/components/MissingVideoImage';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

export default function TopicPage() {

  const params = useParams();
  const topic = decodeURIComponent(params.topic);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const from = parseInt(searchParams.get('von'), 10);
  const to = parseInt(searchParams.get('bis'), 10);

  const [itemImages, setItemImages] = useState({});
  const [itemVideos, setItemVideos] = useState({});
  const [activeId, setActiveId] = useState(null);

  // load metadata for all items of the topic in and out of year range
  useEffect(() => {
    async function loadData() {
      const recordList = await getRecordList(topic);
      setFilteredItems(recordList);
      console.log("Get Record List from API with function", recordList)
      setLoading(false);
    }

    loadData();
  }, [topic, from, to]);

  // helper function to check if item is in the specified year range
  const isInYearRange = useCallback((item) => {
    if (!from || !to) return true;
    if (Array.isArray(item.year)) {
      return item.year.some(y => y >= from && y <= to);
    }
    return item.year >= from && item.year <= to;
  }, [from, to]);
  
  // store items in year range and out of year range
  // useMemo to avoid recalculating on every render
  // sort items by year in ascending order
  const [inRange, outOfRange] = useMemo(() => {

    const inRangeItems = filteredItems.filter(isInYearRange);
    const outOfRangeItems = filteredItems.filter(item => !isInYearRange(item));

    inRangeItems.sort((a, b) => (a.year[0] ?? 0) - (b.year[0] ?? 0));
    outOfRangeItems.sort((a, b) => (a.year[0] ?? 0) - (b.year[0] ?? 0));
    
    console.log("in Range", inRangeItems);
    console.log("out of Range", outOfRangeItems);

    return [inRangeItems, outOfRangeItems];
  }, [filteredItems, isInYearRange]);

  // load images first, then videos for all items in year range
  useEffect(() => {
    let cancelled = false;
    async function loadImagesAndVideos() {
      // Load all images first
      const images = {};
      for (const item of inRange) {
        if (cancelled) return;
        images[item.id] = await fetchImage(item.id);
        setItemImages(prev => ({ ...prev, [item.id]: images[item.id] }));
      }
      // Load all videos
      const videos = {};
      for (const item of inRange) {
        if (cancelled) return;
        videos[item.id] = await fetchVideo(item.id);
        setItemVideos(prev => ({ ...prev, [item.id]: videos[item.id] }));
      }
    }
    if (inRange.length > 0) loadImagesAndVideos();
    return () => { cancelled = true; };
  }, [inRange]);

  // --------------------------  Visual Website Return ------------------------------- //

  if (loading) return <div>Loading...</div>;

  return (
    <div className="topic-page">
      <SideNav page="topic-page" entry="null" from={from} to={to} filteredItems={filteredItems} inRange={inRange} topic={topic} />
      <ul>
        {inRange.map((item) => (
          <li key={item.id} style={{ position: 'relative' }} marker="none" >
            <div className="item-flex">
              {activeId === item.id && itemVideos[item.id] ? (
                // Show video when active and video exists
                <video
                  src={itemVideos[item.id]}
                  poster={itemImages[item.id]}
                  width={320}
                  height={180}
                  controls
                  style={{ objectFit: 'cover', background: '#000', cursor: 'pointer' }}
                />
              ) : itemVideos[item.id] ? (
                // Show video frame (poster) if video exists
                <video
                  src={itemVideos[item.id]}
                  poster={itemImages[item.id]}
                  width={320}
                  height={180}
                  preload="metadata"
                  controls={true}
                  style={{ objectFit: 'cover', background: '#000', cursor: 'pointer' }}
                  onClick={() => setActiveId(activeId === item.id ? null : item.id)}
                />
              ) : itemImages[item.id] ? (
                // Show image if no video but image exists
                <img
                  src={itemImages[item.id]}
                  alt={item.title}
                  width={320}
                  height={180}
                  style={{ objectFit: 'cover', background: '#000' }}
                />
              ) : (
                // Show spinner if still loading, else show placeholder
                <div style={{ width: 320, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="spinner" />
                </div>
              )}
              {/* // Show placeholder if neither video nor image exists
              <MissingVideoImage width={320} height={180} />
            )} */}
              <div className="item-info">

                <a href={`/objekt/${item.id}?topic=${encodeURIComponent(topic)}`} className="block">
                  {/* title of the object */}
                  <h1 dangerouslySetInnerHTML={{ __html: item.title }}></h1>
                </a>
                {/* ID and Year of the object */}

                <h3>
                  {item.year.join('-')}
                </h3>
                <br />
                {/* other tobic tags the object has */}
                {item.topic && item.topic.length > 1 && (
                  <p>
                    <span>→ weitere Themen: </span>
                    {item.topic
                      .filter(t => t !== topic)
                      .map(t => (
                        <a key={t} href={`/themen/${encodeURIComponent(t)}`}>
                          {t}
                        </a>
                      ))
                      .reduce((prev, curr) => [prev, " ", curr])}
                  </p>
                )}
                <p>
                <span>→ </span>
                <a href={`/objekt/${item.id}?topic=${encodeURIComponent(topic)}`} className="block">mehr über das Video </a>
                </p>
              </div>
            </div>
            <br />
          </li>
        ))}
      </ul>
      {outOfRange.length > 0 && (
        <div>
          <h2>Einträge zum Thema &quot;{topic}&quot; aus anderen Jahren</h2>
          <ul>
            {outOfRange.map((item) => (
              <li key={item.id}>
                <a href={`/objekt/${item.id}?topic=${encodeURIComponent(topic)}`} className="block">
                  {/* title of the object */}
                  <h1 dangerouslySetInnerHTML={{ __html: item.title }}></h1>
                </a>
                <p>
                  {item.year.join('-')}
                </p>
                <br />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}