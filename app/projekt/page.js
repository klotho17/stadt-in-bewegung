import ProjectIcon from './../components/ProjectIcon';

export default function ProjectPage() {
  return (
    <div className="project-page">
      <a href="/">
      <ProjectIcon width={70} height={40} />
      </a>
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