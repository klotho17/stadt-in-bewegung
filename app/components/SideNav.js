'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SideNav({ topic, from, to }) {
  const router = useRouter();

  return (
    <nav className="side-nav">
      <ul>
        <li>
          <Link href="/">Startseite</Link>
        </li>
        {(from && to) && (
          <li>
            <span>Zeitraum: {from} – {to}</span>
          </li>
        )}
        {topic && (
          <li>
            <button
              className="abstract-button"
              onClick={() => router.back()}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
            >
              ← zurück: {" "}{topic}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}