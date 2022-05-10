import fs from 'fs/promises';
import { Project, ProjectMetadata } from '../../sharedTypes';

const retrieveDateModified: (filePath: string) => Promise<Date> = async (
  filePath
) => {
  const fileStats = await fs.stat(filePath);

  return fileStats.mtime;
};

const retrieveSize: (filePath: string) => Promise<number> = async (
  filePath
) => {
  const fileStats = await fs.stat(filePath);

  return fileStats.size;
};

const retrieveProjectMetadata: (
  project: Pick<Project, 'projectFilePath' | 'mediaFilePath'>
) => Promise<ProjectMetadata> = async (project) => {
  const projectLastModified =
    project.projectFilePath === null
      ? null
      : await retrieveDateModified(project.projectFilePath);

  const mediaSize =
    project.mediaFilePath === null
      ? null
      : await retrieveSize(project.mediaFilePath);

  return {
    dateModified: projectLastModified,
    mediaSize,
  };
};

export default retrieveProjectMetadata;
