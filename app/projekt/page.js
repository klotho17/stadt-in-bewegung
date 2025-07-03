import ProjectIcon from './../components/ProjectIcon';
import Link from 'next/link';

export default function ProjectPage() {
  return (
    <div className="project-page">
      {/* Add a link to the main page */}
      <ProjectIcon width={70} height={40} />
      
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