import ProjectIcon from './../components/ProjectIcon';
import Link from 'next/link';

export default function ProjectPage() {
  return (
    <div className="project-page">
      <Link href="/">
      <ProjectIcon width={70} height={40} />
      </Link>
      <h1>Projekt</h1>
      <p>
        Informationen zum Projekt/Masterarbeit
        quellenangaben
        Copy-Paste Einleitung, 
        Link GitHub 
        Jupytr-Notebook (online stellen)
        Link Memobase/Sozialarchiv/Bild+Ton
      </p>
    </div>
  );
}