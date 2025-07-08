'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NavImage from './NavImage';

export default function SideNav({ entry, topic, from, to, filteredItems, inRange, page }) {
  const router = useRouter();

  return (
    <nav className="side-nav">
      <ul>
        {page === "topic-page" && (
          <li>
            <p>{inRange.length} Videos mit dem Thema </p>
            <h3>
              {topic}
            </h3>
            <p>
              {from && to ? `aus ${from}–${to}` : ""}
            </p>
          </li>
        )}
        <li>
        ← {" "}
        {/* back to full overview with year filter if available */}
        {from && to ? (
        <Link href={`/?von=${from}&bis=${to}`}>
         Übersicht ({from}–{to}) <br/> <NavImage width={80} height={40} />
        </Link>
      ) : (
        <Link href="/">
        Übersicht<br/> <NavImage width={80} height={40} />
        </Link>
      )}
      </li>
        {/* back to the previous topic overview*/}
        {page==="object-page" && topic && (
          <li> 
            <p>← Videoübersicht zu </p>
            <p
              className="back-to-topic"
              onClick={() => router.back()}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
            >
              {" "}{topic}
            </p>
          </li>
        )}
        {/* if video has other topics */}
        {entry.topic && entry.topic.length > 1 && (
          <li>
            <span>→ weitere Themen dieses Videos: </span>
            {entry.topic
              .filter(t => t !== topic)
              .map(t => (
                <a key={t} href={`/themen/${t}`}>
                  {t}
                </a>
              ))
              .reduce((prev, curr) => [prev, " ", curr])}
          </li>
        )}
      </ul>
    </nav>
  );
}