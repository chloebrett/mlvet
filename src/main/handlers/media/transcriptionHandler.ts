import ffmpeg from 'fluent-ffmpeg';
import { TRANSCRIPTION_ENGINE } from '../../config';
import {
  PartialWord,
  RuntimeProject,
  Transcription,
} from '../../../sharedTypes';
import preProcessTranscript from '../../editDelete/preProcess';
import { ffmpegPath, ffprobePath } from '../../ffUtils';
import { JSONTranscription } from '../../types';
import { getAudioExtractPath } from '../../util';
import transcribe from './transcribe';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

/**
 * This is an easy (but kind of annoying) approach to validating incoming JSON.
 * The idea is that we only have types at compile time, but we need to validate at
 * runtime. Other solutions include:
 * 1. Just trust that the JSON is valid, and cast it
 * 2. More advanced solutions that generate runtime checks based off typescript types
 * (e.g. https://github.com/YousefED/typescript-json-schema)
 */

const validateWord = <(word: any) => word is PartialWord>(
  ((word) =>
    typeof word.word === 'string' &&
    typeof word.duration === 'number' &&
    typeof word.confidence === 'number' &&
    typeof word.startTime === 'number')
);

const validateJsonTranscription = <
  (transcription: any) => transcription is JSONTranscription
>((transcription) =>
  Array.isArray(transcription.words) &&
  transcription.words.every(validateWord));

type GetAudioDurationInSeconds = (
  audioFilePath: string
) => Promise<number | undefined>;

const getAudioDurationInSeconds: GetAudioDurationInSeconds = async (
  audioFilePath
) => {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(audioFilePath, (_, metadata) => {
      resolve(metadata.format.duration);
    });
  });
};

type RequestTranscription = (
  project: RuntimeProject
) => Promise<Transcription | null>;

const requestTranscription: RequestTranscription = async (project) => {
  if (project.mediaFilePath == null) {
    return null;
  }

  const transcript = await transcribe(project, TRANSCRIPTION_ENGINE);

  if (!validateJsonTranscription(transcript)) {
    throw new Error('JSON transcript is invalid');
  }

  const duration: number =
    (await getAudioDurationInSeconds(getAudioExtractPath(project.id))) || 0;

  const processedTranscript = preProcessTranscript(transcript, duration, true);

  return processedTranscript;
};

export default requestTranscription;
