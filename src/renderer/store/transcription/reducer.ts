import { Reducer } from 'redux';
import { mapInRanges } from 'renderer/util';
import { updateOutputStartTimes } from 'transcriptProcessing/updateOutputStartTimes';
import {
  TRANSCRIPTION_CREATED,
  DELETE_SELECTION,
  PASTE_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_PASTE_WORD,
} from './actions';
import { Transcription, Word } from '../../../sharedTypes';
import { Action } from '../action';
import {
  DeleteSelectionPayload,
  MergeWordsPayload,
  PasteWordsPayload,
  SplitWordPayload,
  UndoDeleteSelectionPayload,
  UndoMergeWordsPayload,
  UndoPasteWordsPayload,
  UndoSplitWordPayload,
} from '../undoStack/opPayloads';
import {
  DELETE_SELECTION,
  MERGE_WORDS,
  PASTE_WORD,
  SPLIT_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_MERGE_WORDS,
  UNDO_PASTE_WORD,
  UNDO_SPLIT_WORD,
} from '../undoStack/ops';

/**
 *  Nested reducer for handling transcriptions
 */
const transcriptionReducer: Reducer<Transcription | null, Action<any>> = (
  transcription = null,
  action
) => {
  if (action.type === TRANSCRIPTION_CREATED) {
    return action.payload as Transcription;
  }

  // Everything below here assumes we have a transcription, so early exit if we don't
  if (transcription === null) {
    return null;
  }

  /**
   * Important: if you make an update to the transcription here, usually you
   * will need to call 'updateOutputStartTimes' so that output start times are kept accurate!
   */

  if (action.type === DELETE_SELECTION) {
    const { ranges } = action.payload as DeleteSelectionPayload;

    const markDeleted = (word: Word) => ({ ...word, deleted: true });

    const newWords = mapInRanges(transcription.words, markDeleted, ranges);

    return {
      ...transcription,
      words: updateOutputStartTimes(newWords),
    };
  }

  if (action.type === UNDO_DELETE_SELECTION) {
    const { ranges } = action.payload as UndoDeleteSelectionPayload;

    const markUndeleted = (word: Word) => ({ ...word, deleted: false });

    return {
      ...transcription,
      words: updateOutputStartTimes(
        mapInRanges(transcription.words, markUndeleted, ranges)
      ),
    };
  }

  if (action.type === PASTE_WORD) {
    const { startIndex, clipboard } = action.payload as PasteWordsPayload;

    const prefix = transcription.words.slice(0, startIndex + 1);

    // Paste key must be unique for all pasted words - that is, no two pasted words should ever have the same paste key.
    // We force this invariant by finding the highest paste key in the entire transcription to this point, and then
    // adding n to it for the nth pasted word, for all words on the clipboard.
    const highestExistingPasteKey = Math.max(
      0,
      ...transcription.words.map((word) => word.pasteKey)
    );
    const wordsToPaste = clipboard.map((word, index) => ({
      ...word,
      pasteKey: highestExistingPasteKey + index + 1,
    }));

    const suffix = transcription.words.slice(startIndex + 1);

    return {
      ...transcription,
      words: updateOutputStartTimes([...prefix, ...wordsToPaste, ...suffix]),
    };
  }

  if (action.type === UNDO_PASTE_WORD) {
    const { startIndex, clipboardLength } =
      action.payload as UndoPasteWordsPayload;

    const prefix = transcription.words.slice(0, startIndex + 1);
    const suffix = transcription.words.slice(startIndex + clipboardLength + 1);

    return {
      ...transcription,
      words: updateOutputStartTimes([...prefix, ...suffix]),
    };
  }

  if (action.type === MERGE_WORDS) {
    const { range } = action.payload as MergeWordsPayload;
    const { words } = transcription;

    const prefix = words.slice(0, range.startIndex);
    const suffix = words.slice(range.endIndex);

    const firstWord = words[range.startIndex];
    const lastWord = words[range.endIndex - 1];
    const wordsToMerge = words.slice(range.startIndex, range.endIndex);

    const mergedText = wordsToMerge.map((word) => word.word).join(' ');

    const mergedWord: Word = {
      ...firstWord,
      word: mergedText,
    };

    return {
      ...transcription,
      words: updateOutputStartTimes([...prefix, mergedWord, ...suffix]),
    };
  }

  if (action.type === UNDO_MERGE_WORDS) {
    const { index, originalWords } = action.payload as UndoMergeWordsPayload;

    return transcription;
  }

  if (action.type === SPLIT_WORD) {
    const { index } = action.payload as SplitWordPayload;

    return transcription;
  }

  if (action.type === UNDO_SPLIT_WORD) {
    const { range } = action.payload as UndoSplitWordPayload;

    return transcription;
  }

  return transcription;
};

export default transcriptionReducer;
