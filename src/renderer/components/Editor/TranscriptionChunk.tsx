import { MousePosition } from '@react-hook/mouse-position';
import { Dispatch, SetStateAction } from 'react';
import { instanceofTakeGroup } from 'renderer/utils/takeDetection';
import { TakeGroup, Word } from 'sharedTypes';
import TakeGroupComponent from './TakeGroupComponent';
import { DragState, WordMouseHandler } from './WordDragManager';
import WordOuterComponent from './WordOuterComponent';

interface TranscriptionChunkProps {
  chunk: Word | TakeGroup;
  chunkIndex: number;
  onWordMouseDown: WordMouseHandler;
  onWordMouseMove: any;
  dragState: DragState;
  isWordBeingDragged: (wordIndex: number) => boolean;
  mousePosition: MousePosition;
  mouseThrottled: MousePosition;
  dropBeforeIndex: number | null;
  setDropBeforeIndex: Dispatch<SetStateAction<number | null>>;
  cancelDrag: () => void;
  editWord: any;
  nowPlayingWordIndex: number | null;
}

const TranscriptionChunk = ({
  chunk,
  chunkIndex,
  onWordMouseDown,
  onWordMouseMove,
  dragState,
  isWordBeingDragged,
  mousePosition,
  mouseThrottled,
  dropBeforeIndex,
  setDropBeforeIndex,
  cancelDrag,
  editWord,
  nowPlayingWordIndex,
}: TranscriptionChunkProps) => {
  return (
    <>
      {instanceofTakeGroup(chunk) ? (
        <TakeGroupComponent
          takeGroup={chunk as TakeGroup}
          chunkIndex={chunkIndex}
          onWordMouseDown={onWordMouseDown}
          onWordMouseMove={onWordMouseMove}
          dragState={dragState}
          isWordBeingDragged={isWordBeingDragged}
          mousePosition={mousePosition}
          mouseThrottled={mouseThrottled}
          dropBeforeIndex={dropBeforeIndex}
          setDropBeforeIndex={setDropBeforeIndex}
          cancelDrag={cancelDrag}
          editWord={editWord}
          nowPlayingWordIndex={nowPlayingWordIndex}
        />
      ) : (
        <WordOuterComponent />
      )}
    </>
  );
};

export default TranscriptionChunk;
