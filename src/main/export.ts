/* eslint-disable no-plusplus */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { Project } from '../sharedTypes';
import Transcription from '../sharedTypes/Transcription';
import { padZeros, integerDivide, mkdir } from './util';

// 00:00:00:00
const secondToTimestamp: (num: number) => string = (num) => {
  return [3600, 60, 1, 0.01]
    .map((mult) => padZeros(integerDivide(num, mult), 2))
    .join(':');
};

const constructEDL: (title: string, transcription: Transcription) => string = (
  title,
  transcription
) => {
  let output = `TITLE: ${title}\nFCM: NON-DROP FRAME\n\n`;
  const { words } = transcription;
  const entries = words.length;

  output += words
    .map((word, i) => {
      const edlEntry = `${padZeros(i + 1, entries)}\tAX\tAA/V\tC`;

      const editStart = secondToTimestamp(word.starTime);
      const editEnd = secondToTimestamp(word.starTime + word.duration);

      return `${edlEntry}\t${editStart}\t${editEnd}\n* FROM CLIP NAME: sample\n\n`;
    })
    .join('');

  return output;
};

export const exportEDL = (project: Project) => {
  mkdir(project.savePath);

  if (project.transcription) {
    writeFileSync(
      join(project.savePath, `${project.name}.edl`),
      constructEDL(project.name, project.transcription)
    );
  }
};

export default exportEDL;
