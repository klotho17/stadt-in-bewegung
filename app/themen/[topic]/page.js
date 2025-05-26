'use client';

import { getRecordList } from '@/app/api/get-record-list'; // API-call to fetch records of a specific topic
import { fetchImage } from '@/app/utils/imageurl';
import { fetchVideo } from '@/app/utils/videourl';

import { useEffect, useState } from 'react';
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
      console.log("doctype of item.id", typeof recordList[0].id)
      console.log("FilteredItems", filteredItems)

      setLoading(false);
    }

    loadData();
  }, [topic, from, to]);

  // store items in year range and out of year range
  const inRange = filteredItems.filter(isInYearRange);
  const outOfRange = filteredItems.filter(item => !isInYearRange(item));
  //const sortedItems = [...inRange, ...outOfRange]; // combined array, not used?
  console.log("in Range", inRange);
  console.log("out of Range", outOfRange);

  // load images for items in year range... and videos?
  useEffect(() => {
  async function loadImagesAndVideos() {
    const images = {};
    const videos = {};
    for (const item of inRange) {
      images[item.id] = await fetchImage(item.id);
      videos[item.id] = await fetchVideo(item.id);
    }
    setItemImages(images);
    setItemVideos(videos);
  }
  if (inRange.length > 0) loadImagesAndVideos();
  }, [topic, from, to, filteredItems]);

  // helper function to check if item is in the specified year range
  function isInYearRange(item) {
    if (!from || !to) return true;
    if (Array.isArray(item.year)) {
      return item.year.some(y => y >= from && y <= to);
    }
    return item.year >= from && item.year <= to;
  }

// insert click?

  // --------------------------  Visual Website Return ------------------------------- //

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>
        {filteredItems.length} Einträge zum Thema &quot;{topic}&quot;,
        {from && to ? ` ${inRange.length} aus der Zeit ${from}–${to}` : ""}
      </h1>
      <ul>
          {inRange.map((item) => (
    <li
      key={item.id}
      style={{ position: 'relative', cursor: 'pointer' }}
      onClick={() => setActiveId(activeId === item.id ? null : item.id)}
    >
      {activeId === item.id && itemVideos[item.id] ? (
        <video
          src={itemVideos[item.id]}
          poster={itemImages[item.id]}
          width={320}
          height={180}
          autoPlay
          muted
          controls
          style={{ objectFit: 'cover', background: '#000' }}
        />
      ) : (
        <video
          src={itemVideos[item.id]}
          poster={itemImages[item.id]}
          width={320}
          height={180}
          preload="metadata"
          controls={true}
          style={{ objectFit: 'cover', background: '#000' }}
        />
      )}
            <a href={`/objekt/${item.id}`} className="block">
              {/* title of the object */}
              <h3 className="font-medium">{item.title}</h3>
            </a>
            {/* ID and Year of the object */}
            <p>
              Datei-tmp-------: {item.id}
            </p>
            <div>
              <span>Jahr: </span>
              {item.year.join(', ')}
            </div>
            {/* other tobic tags the object has */}
            {item.topic && item.topic.length > 1 && (
              <div>
                <span>Weitere Themen: </span>
                {item.topic.filter(t => t !== topic).join(', ')}
              </div>
            )}
            <br />
          </li>
        ))}
      </ul>
      {outOfRange.length > 0 && (
        <div>
          <h2>Weitere Einträge zum Thema &quot;{topic}&quot;</h2>
          <ul>
            {outOfRange.map((item) => (
              <li key={item.id}>
                <a href={`/objekt/${item.id}`} className="block">
                  {/* title of the object */}
                  <h3 className="font-medium">{item.title}</h3>
                  {/* ID and Year of the object */}
                </a>
                <p>
                  Datei-tmp-------: {item.id}
                </p>
                <div>
                  <span>Jahr: </span>
                  {item.year.join(', ')}
                </div>
                <br />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}