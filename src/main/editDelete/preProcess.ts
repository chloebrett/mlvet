import { MapCallback, roundToMs } from '../util';
import { Transcription, Word } from '../../sharedTypes';
import { JSONTranscription, SnakeCaseWord } from '../types';

type PartialWord = Pick<Word, 'word' | 'inputStartTime' | 'duration'>;

/**
 * Replace the start_time attribute with startTime (can be generalised further but shouldn't
 * need this once python outputs camelcase anyway)
 * @param word snake cased partial word
 * @returns camel cased partial word
 */
const camelCase: MapCallback<SnakeCaseWord, PartialWord> = (word) => ({
  word: word.word,
  duration: word.duration,
  inputStartTime: word.start_time,
});

/**
 * Adjusts durations so that words last until the next word, or until the end of the transcript
 * if the last word
 * @param totalDuration total duration of transcript
 * @returns word with durations updated
 */
const fillDurationGaps: (
  totalDuration: number
) => MapCallback<PartialWord, PartialWord> =
  (totalDuration) => (word, i, words) => {
    const isLastWord = i === words.length - 1;
    const durationUntil = isLastWord
      ? totalDuration
      : words[i + 1].inputStartTime;

    return {
      ...word,
      duration: roundToMs(durationUntil - word.inputStartTime),
    };
  };

/**
 * Injects extra attributes into a PartialWord to make it a full Word -
 * @param word the word to fill attributes for
 * @param i index of the word in the transcript
 * @returns full Word object
 */
const injectAttributes: MapCallback<PartialWord, Word> = (word, i) => ({
  ...word,
  outputStartTime: 0,
  key: i.toString(),
  deleted: false,
  fileName: 'PLACEHOLDER FILENAME',
});

/**
 * Pre processes a JSON transcript from python for use in the front end
 * @param jsonTranscript the JSON transcript input (technically a JS object but with some fields missing)
 * @param duration duration of the input media file
 * @returns formatted Transcript object
 */
const preProcessTranscript = (
  jsonTranscript: JSONTranscription,
  duration: number
): Transcription => {
  return {
    confidence: jsonTranscript.confidence,
    words: jsonTranscript.words
      .map(camelCase)
      .map(fillDurationGaps(duration))
      .map(injectAttributes),
  };
};

export default preProcessTranscript;
