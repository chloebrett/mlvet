import { v4 as uuidv4 } from 'uuid';
import { CURRENT_SCHEMA_VERSION } from '../constants';
import {
  AudioFileExtension,
  RuntimeProject,
  MapCallback,
  VideoFileExtension,
} from '../sharedTypes';
import ipc from './ipc';

const { extractThumbnail } = ipc;

export const extractFileExtension: (filePath: string) => string | null = (
  filePath
) => {
  const filePathSplit = filePath.split('.');
  const extension = filePathSplit[filePathSplit.length - 1];
  if (extension === '') {
    return null;
  }
  return extension;
};

export const getMediaType: (extension: string) => 'audio' | 'video' | null = (
  extension
) => {
  const audioFileExtensions = ['mp3'];
  const videoFileExtensions = ['mp4'];

  if (audioFileExtensions.includes(extension)) {
    return 'audio';
  }
  if (videoFileExtensions.includes(extension)) {
    return 'video';
  }

  return null;
};

export const makeProject: (
  projectName: string,
  mediaFilePath: string | null
) => Promise<RuntimeProject | null> = async (projectName, mediaFilePath) => {
  if (mediaFilePath === null) {
    return null;
  }

  const mediaFileExtension = extractFileExtension(mediaFilePath);
  if (mediaFileExtension === null) {
    return null;
  }

  const mediaType = getMediaType(mediaFileExtension);
  if (mediaType === null) {
    return null;
  }

  const project: RuntimeProject = {
    id: uuidv4(),
    name: projectName,
    mediaType,
    mediaFileExtension: mediaFileExtension as
      | AudioFileExtension
      | VideoFileExtension,
    mediaFilePath,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    transcription: null,
    projectFilePath: null,
    isEdited: false,
  };

  const thumbnailPath = await extractThumbnail(mediaFilePath, project);
  if (thumbnailPath === null) {
    return null;
  }

  return project;
};

export const makeProjectWithoutMedia: (
  projectName: string
) => Promise<RuntimeProject | null> = async (projectName) => {
  const project: RuntimeProject = {
    id: uuidv4(),
    name: projectName,
    schemaVersion: 0,
    projectFilePath: null,
    mediaFilePath: null,
    transcription: null,
    mediaType: 'video',
    mediaFileExtension: 'mp4',
    isEdited: false,
  };

  return project;
};

export const updateProjectMediaFilePath: (
  currentProject: RuntimeProject,
  mediaFilePath: string | null
) => Promise<RuntimeProject | null> = async (currentProject, mediaFilePath) => {
  if (mediaFilePath === null) {
    return null;
  }

  currentProject.mediaFilePath = mediaFilePath;

  return currentProject;
};

export const updateProjectWithMedia: (
  currentProject: RuntimeProject,
  mediaFilePath: string | null
) => Promise<RuntimeProject | null> = async (currentProject, mediaFilePath) => {
  if (mediaFilePath === null) {
    return null;
  }

  const fileExtension = extractFileExtension(mediaFilePath);
  if (fileExtension === null) {
    return null;
  }

  const mediaType = getMediaType(fileExtension);
  if (mediaType === null) {
    return null;
  }

  const thumbnailPath = await extractThumbnail(mediaFilePath, currentProject);
  if (thumbnailPath === null) {
    return null;
  }

  currentProject.mediaType = mediaType;
  currentProject.mediaFileExtension = fileExtension as
    | AudioFileExtension
    | VideoFileExtension;
  currentProject.mediaFilePath = mediaFilePath;
  currentProject.schemaVersion = CURRENT_SCHEMA_VERSION;
  currentProject.transcription = null;

  return currentProject;
};

export const updateProjectWithExtractedAudio: (
  currentProject: RuntimeProject,
  extractedAudioFilePath: string | null
) => Promise<RuntimeProject | null> = async (
  currentProject,
  extractedAudioFilePath
) => {
  if (extractedAudioFilePath === null) {
    return null;
  }

  return currentProject;
};

export const formatDate: (date: Date) => string = (date) => {
  // dd/mm/yy
  const dd = date.getDate().toString(); // days start at 1
  const mm = (date.getMonth() + 1).toString(); // months start at 0 because JavaScript hates us
  const yy = (date.getFullYear() % 100).toString();

  const pad: (val: string) => string = (val) =>
    val.length === 1 ? `0${val}` : val;

  return [dd, mm, yy].map(pad).join('/');
};

export const removeExtension: (fileName: string) => string = (fileName) => {
  const split = fileName.split('.');
  return split.slice(0, split.length - 1).join('.');
};

/**
 * Maps the values of a list using a given map function,
 * but only for those values within a range of indices.
 * Values outside of the given indices will be unaltered.
 * @returns the mapped list
 */
export const mapInRange: <T>(
  list: T[],
  predicate: MapCallback<T, T>,
  startIndex: number,
  endIndex: number
) => T[] = (list, mapCallback, startIndex, endIndex) => [
  ...list.slice(0, startIndex),
  ...list.slice(startIndex, endIndex).map(mapCallback),
  ...list.slice(endIndex),
];
