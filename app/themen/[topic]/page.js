'use client';

import { getRecordList } from '@/app/api/get-record-list';

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

  function isInYearRange(item) {
    if (!from || !to) return true;
    if (Array.isArray(item.year)) {
      return item.year.some(y => y >= from && y <= to);
    }
    return item.year >= from && item.year <= to;
  }

  const inRange = filteredItems.filter(isInYearRange);
  const outOfRange = filteredItems.filter(item => !isInYearRange(item));
  const sortedItems = [...inRange, ...outOfRange];
  console.log("in Range", inRange);
  console.log("out of Range", outOfRange);
  // --------------------------  Visual Website Return ------------------------------- //

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>
        {filteredItems.length} Einträge zum Thema &quot;{topic}&quot;,
        {from && to ? ` ${inRange.length} aus der Zeit ${from}–${to}` : ""}
      </h1>
      <ul>
        {inRange?.map((item) => (
          <li data-key={item.id} key={item.id}>
            {/* <pre>
              {JSON.stringify(item, null, 2)}
            </pre> */}
            
            <a href={`/objekt/${item.id}`} className="block">
              {/* title of the object */}
              <h3 className="font-medium">{item.title}</h3>
              {/* ID and Year of the object */}
            </a>
              <p>
                Datei---: {item.id}
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
            <br/>
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
                  Datei: {item.id}
                </p>
                <div>
                  <span>Jahr: </span>
                  {item.year.join(', ')}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}