import ipc from 'renderer/ipc';
import { Word } from 'sharedTypes';
import { Action } from '../action';

export const CLIPBOARD_UPDATED = 'CLIPBOARD_UPDATED';

const updateClipboardEnabledInMenu: (clipboard: Word[]) => void = (
  clipboard
) => {
  const pasteEnabled = clipboard.length > 0;

  // TODO(chloe): smarter logic for this (only enabled cut, copy, delete if there is a selection, etc).
  ipc.setClipboardEnabled(true, true, pasteEnabled, true);
};

// Action to update the clipboard contents when words are copied
export const clipboardUpdated: (clipboard: Word[]) => Action<Word[]> = (
  clipboard
) => {
  updateClipboardEnabledInMenu(clipboard);

  return {
    type: CLIPBOARD_UPDATED,
    payload: clipboard,
  };
};