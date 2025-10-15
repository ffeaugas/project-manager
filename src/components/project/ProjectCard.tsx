import { ProjectCardSelect } from './types';

const ProjectCard = ({ data }: { data: ProjectCardSelect }) => {
  return <div>{data.name}</div>;
};

export default ProjectCard;
