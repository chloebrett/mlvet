/* eslint-disable no-plusplus */
import { BrowserWindow } from 'electron';
import { writeFileSync } from 'fs';
import path, { join } from 'path';
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import { secondToEDLTimestamp, padZeros } from '../timeUtils';
import { RuntimeProject, Transcription } from '../../sharedTypes';
import { mkdir } from '../util';
import convertTranscriptToCuts from '../../transcriptProcessing/transcriptToCuts';
import { fracFpsToDec } from '../handlers/helpers/exportUtils';

export const constructEDL: (
  title: string,
  transcription: Transcription,
  source: string | null,
  mainWindow: BrowserWindow | null
) => Promise<string> = async (title, transcription, source, mainWindow) => {
  if (!source) {
    throw Error('No Video Source');
  } else {
    const videoData = await ffprobe(source, { path: ffprobeStatic.path });
    const fps = fracFpsToDec(videoData.streams[0].avg_frame_rate);
    let output = `TITLE: ${title}\nFCM: NON-DROP FRAME\n\n`;

    const cuts = convertTranscriptToCuts(transcription);
    const entries = cuts.length;

    const timeline = {
      start: 0,
      end: 0,
    };

    output += cuts
      .map((cut, i) => {
        const edlEntry = `${padZeros(
          i + 1,
          Math.max(Math.floor(Math.log10(entries)) + 1, 3)
        )}  AX       AA/V  C`;

        const editStart = secondToEDLTimestamp(cut.startTime, fps);
        const editEnd = secondToEDLTimestamp(cut.startTime + cut.duration, fps);

        timeline.start = timeline.end;
        timeline.end = timeline.start + cut.duration;

        const timelineStart = secondToEDLTimestamp(timeline.start, fps);
        const timelineEnd = secondToEDLTimestamp(timeline.end, fps);

        mainWindow?.webContents.send('export-progress-update', i / entries);

        return `${edlEntry}        ${editStart} ${editEnd} ${timelineStart} ${timelineEnd}\n* FROM CLIP NAME: ${source}\n\n`;
      }, timeline)
      .join('');
    return output;
  }
};

export const exportEDL: (
  exportFilePath: string,
  mainWindow: BrowserWindow | null,
  project: RuntimeProject
) => void = (exportFilePath, mainWindow, project) => {
  const exportDir = path.dirname(exportFilePath);

  mkdir(exportDir);

  const exportFilename = path.basename(
    exportFilePath,
    path.extname(exportFilePath)
  );

  if (project.transcription) {
    // eslint-disable-next-line promise/catch-or-return
    constructEDL(
      project.name,
      project.transcription,
      project.mediaFilePath,
      mainWindow
    )
      // eslint-disable-next-line promise/always-return
      .then((edl) => {
        writeFileSync(join(exportDir, `${exportFilename}.edl`), edl);
      });
    mainWindow?.webContents.send(
      'finish-export',
      project,
      project.projectFilePath
    );
  }
};

export default exportEDL;
