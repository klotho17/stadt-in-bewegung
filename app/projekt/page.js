import ProjectIcon from './../components/ProjectIcon';
import Link from 'next/link';

export default function ProjectPage() {
  return (
    <div className="project-page">
      <Link href="/">
        <ProjectIcon width={70} height={40} />
      </Link>
      <br />
      <h1>Projekt</h1>
      <br />
      <p>
        Informationen zum Projekt/Masterarbeit
        quellenangaben
        Copy-Paste Einleitung, 
        <Link href="https://github.com/klotho17/stadt-in-bewegung" target="_blank">Code auf GitHub</Link>
      </p>
    </div>
  );
}