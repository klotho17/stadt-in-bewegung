'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getRecordList } from '@/app/api/get-record-list';

export default function TopicPage() {

  const params = useParams();
  const topic = decodeURIComponent(params.topic);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const recordList = await getRecordList(topic);

      /*
      // Fetch data from the JSON files with function in utils/jsonscript.js or use cached data
      let data = getCachedData();
      if (!data) {
        console.log("Fetching data...");
        data = await fetchMetadata();
        setCachedData(data);
      } else {
        console.log("Using cached data...");
      }
      setObjects(data);
      */
      setFilteredItems(recordList);
      setLoading(false);
    }

    loadData();
  }, [topic]);

  // --------------------------  Visual Website Return ------------------------------- //

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{filteredItems.length} Einträge zum Thema &quot;{topic}&quot; gefunden</h1>

      <ul>
        {filteredItems.map((item) => (
          <li data-key={item["@id"]} key={item["@id"]}>
            {/* <pre>
              {JSON.stringify(item, null, 2)}
            </pre> */}
            
            <a href={`/objekt/${item["@id"]}`} className="block">
              {/* title of the object */}
              <h3 className="font-medium">{item.title}</h3>
              {/* fileNumber and Year of the object */}
              <p>
                Datei {item.fileNumber} | Jahr: {item.created.normalizedDateValue || 'Jahr unbekannt'}
              </p>
              {/* other tobic tags the object has */}
              {item.topic && item.topic.length > 0 && (
                <div>
                  <span>Weitere Themen: </span>
                  {item.topic.filter(t => t !== topic).join(', ')}
                </div>
              )}
            </a>  {/* ... link goes around the whole li(?) element atm */}
          </li>
        ))}
      </ul>
    </div>
  );
}