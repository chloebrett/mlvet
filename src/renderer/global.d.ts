// Let TypeScript know that the ipcRenderer is on the window object.
// IPC methods declared in main/handlers will be auto-generated here when `yarn gen` is run.
// If you need to use other modules from electron in the renderer, add their types here and then reference from `ipc` (import from renderer/ipc.ts)

import { IpcRendererEvent } from 'electron';
import {
  OperatingSystems,
  RuntimeProject,
  ProjectMetadata,
  RecentProject,
  Transcription,
  ProjectIdAndFilePath,
} from '../sharedTypes';

declare global {
  interface Window {
    electron: {
      // Everything between the START GENERATED CODE and END GENERATED CODE comments will be replaced with the injected handler invocations when 'yarn gen' is run

      // START GENERATED CODE
      deleteProject: (project: ProjectIdAndFilePath) => Promise<void>;

      openProject: (
        filePath: string | null
      ) => Promise<{ project: RuntimeProject | null; filePath: string }>;

      retrieveProjectMetadata: (
        project: Pick<RuntimeProject, 'projectFilePath' | 'mediaFilePath'>
      ) => Promise<ProjectMetadata>;

      readRecentProjects: () => Promise<RecentProject[]>;

      requestMediaDialog: () => Promise<string | null>;

      saveAsProject: (project: RuntimeProject) => Promise<string>;

      saveProject: (project: RuntimeProject) => Promise<string>;

      writeRecentProjects: (recentProjects: RecentProject[]) => Promise<void>;

      extractAudio: (project: RuntimeProject) => Promise<string>;

      exportProject: (project: RuntimeProject) => Promise<string>;

      extractThumbnail: (
        absolutePathToVideoFile: string,
        project: RuntimeProject
      ) => Promise<string>;

      requestTranscription: (
        project: RuntimeProject
      ) => Promise<Transcription | null>;

      setFileRepresentation: (
        representedFilePath: string | null,
        isEdited: boolean
      ) => void;

      setHomeEnabled: (homeEnabled: boolean) => void;

      setSaveEnabled: (saveEnabled: boolean, saveAsEnabled: boolean) => void;

      setUndoRedoEnabled: (undoEnabled: boolean, redoEnabled: boolean) => void;

      getFileNameWithExtension: (filePath: string | null) => Promise<string>;

      handleOsQuery: () => OperatingSystems | null;

      closeWindow: () => void;

      returnToHome: (project: RuntimeProject) => Promise<number>;

      showConfirmation: (message: string, detail: string) => Promise<boolean>;
      // END GENERATED CODE

      on: (
        channel: string,
        listener: (event: IpcRendererEvent, ...args: any[]) => void
      ) => void;
    };
  }
}
export {};
