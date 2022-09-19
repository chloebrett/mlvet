export const PLATFORMS = {
  WINDOWS: 'win32',
  LINUX: 'linux',
  MAC: 'darwin',
};

export const platformPaths = {
  WINDOWS: 'win-x86_64',
  MAC: 'osx-universal',
  LINUX: 'linux-x86_64',
};

export interface WordResult {
  // The confidence rate in the detection. 0 For unlikely, and 1 for totally accurate
  conf: number;
  // The start of the timeframe when the word is pronounced in seconds
  start: number;
  // The end of the timeframe when the word is pronounced in seconds
  end: number;
  // The word detected
  word: string;
}

export interface RecognitionResults {
  // Details about the words that have been detected
  result: WordResult[];
  // The complete sentence that have been detected
  text: string;
}

export interface SpeakerResults {
  // A floating vector representing speaker identity.
  // It is usually about 128 numbers which uniquely represent speaker voice
  spk: number[];
  // The number of frames used to extract speaker vector.
  // The more frames you have the more reliable is speaker vector
  spk_frames: number;
}

export type Result = (SpeakerResults & RecognitionResults) | RecognitionResults;

export interface PartialResults {
  // The partial sentence that have been detected until now
  partial: string;
}

export interface Model {
  handle: any;
  free: () => void;
}

export interface SpeakerModel {
  handle: any;
  free: () => void;
}

export interface Recognizer {
  handle: any;
  free: () => void;
  setMaxAlternatives: (maxAlternatives: number) => void;
  setWords: (words: boolean) => void;
  setPartialWords: (partialWords: boolean) => void;
  setSpkModel: (spkModel: SpeakerModel) => void;
  acceptWaveform: (waveform: Buffer) => boolean;
  resultString: () => string;
  result: () => Result;
  finalResult: () => Result;
  partialResult: () => PartialResults;
  reset: () => void;
}
