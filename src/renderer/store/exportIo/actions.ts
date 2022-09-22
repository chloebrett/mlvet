import { RuntimeProject } from '../../../sharedTypes';
import { Action } from '../action';

export const START_EXPORT = 'START_EXPORT';
export const EXPORT_PROGRESS_UPDATE = 'EXPORT_PROGRESS_UPDATE';
export const FINISH_EXPORT = 'FINISH_UPDATE';

export const startExport: () => Action<any> = () => ({
  type: START_EXPORT,
  payload: {},
});

export const updateExportProgress: (progress: number) => Action<number> = (
  progress
) => ({
  type: EXPORT_PROGRESS_UPDATE,
  payload: progress,
});

export const finishExport: (
  project: RuntimeProject,
  filePath: string | null
) => Action<{ project: RuntimeProject; filePath: string | null }> = (
  project,
  filePath
) => ({
  type: FINISH_EXPORT,
  payload: { project, filePath },
});
