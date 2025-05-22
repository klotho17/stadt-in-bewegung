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
      setFilteredItems(recordList);
      console.log("Get Record List from API with function", recordList)
      console.log("doctype of item.id", typeof recordList[0].id)
      console.log("FilteredItems", filteredItems)

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
        {filteredItems?.map((item) => (
          <li data-key={item.id} key={item.id}>
            {/* <pre>
              {JSON.stringify(item, null, 2)}
            </pre> */}
            
            <a href={`/objekt/${item.id}`} className="block">
              {/* title of the object */}
              <h3 className="font-medium">{item.title}</h3>
              {/* ID and Year of the object */}
              <p>
                Datei {item.id} | Jahr: {item.year || 'Jahr unbekannt'}
              </p>
              {/* other tobic tags the object has */}
              {item.topic && item.topic.length > 0 && (
                <div>
                  <span>Weitere Themen: </span>
                  {item.topic.filter(t => t !== topic).join(', ')}
                </div>
              )}
            </a>  {/* ... link goes around the whole li(?) element atm */}
            <br/>
          </li>
        ))}
      </ul>
    </div>
  );
}