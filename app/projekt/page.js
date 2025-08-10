import ProjectIcon from './../components/ProjectIcon';
import Link from 'next/link';

export default function ProjectPage() {
  return (
    <div className="project-page">
      <Link href="/">
        <ProjectIcon width={70} height={40} />
      </Link>
      <div>
      <br />
      <h1>Projekt</h1>
      </div>
      <div> 
      <p>Die Webapplikation «Audiovisuelles Kulturerbe der Städte in Bewegung 1977-1994» bietet einen visualisierten Sammlungszugang zum Videobestand «Stadt in Bewegung» des Schweizerischen Sozialarchivs Mithilfe der API von Memobase. 
        Der Zugang wurde im Rahmen der Masterarbeit in Digital Humanities an der Universität Basel entwickelt.
      </p>
      <br />
      <p>
        <Link href="https://github.com/klotho17/stadt-in-bewegung" target="_blank">Code auf GitHub</Link>
      </p>
      </div>
    </div>
  );
}