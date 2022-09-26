import { Box, styled } from '@mui/material';
import { ClientId } from 'collabTypes/collabShadowTypes';
import React, { Fragment, RefObject, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ApplicationStore, EditWordState } from 'renderer/store/sharedHelpers';
import { isIndexInRange } from 'renderer/utils/range';
import { IndexRange, Word } from 'sharedTypes';
import { bufferedWordDuration } from 'sharedUtils';
import { PartialSelectState } from './DragSelectManager';
import EditMarker from './EditMarker';
import WordComponent, { WordPassThroughProps } from './WordComponent';
import WordSpace from './WordSpace';

interface WordOuterComponentProps extends WordPassThroughProps {
  word: Word;
  prevWord: Word | null;
  nextWord: Word | null;
  index: number;
  isSelected: boolean;
  isPrevWordSelected: boolean;
  isNextWordSelected: boolean;
  otherSelections: Record<ClientId, IndexRange>;
  editWord: EditWordState;
  popoverWidth: number;
  transcriptionBlockRef: RefObject<HTMLElement>;
  transcriptionLength: number;
  partialSelectState: PartialSelectState | null;
}

const WordAndSpaceContainer = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  height: '24px',
});

const WordOuterComponent = ({
  word,
  index,
  prevWord,
  nextWord,
  isSelected,
  isPrevWordSelected,
  otherSelections,
  editWord,
  popoverWidth,
  transcriptionBlockRef,
  isNextWordSelected,
  transcriptionLength,
  partialSelectState,
  ...passThroughProps
}: WordOuterComponentProps) => {
  const isShowingConfidenceUnderlines = useSelector(
    (store: ApplicationStore) => store.isShowingConfidenceUnderlines
  );

  const collab = useSelector((store: ApplicationStore) => store.collab);

  const otherClients = useMemo(() => {
    if (collab === null || collab.sessionCode === null) {
      return [];
    }

    return collab.clients.filter((client) => client.id !== collab.ownClientId);
  }, [collab]);

  const selectedByClientWithIndex = useMemo(() => {
    if (isSelected) {
      return null;
    }

    const clientIndex = otherClients.findIndex(
      (client) =>
        client.id in otherSelections &&
        isIndexInRange(otherSelections[client.id], index)
    );

    return clientIndex === -1 ? null : clientIndex;
  }, [otherSelections, isSelected, index, otherClients]);

  const [isSelectedByAnotherClientLeftCap, isSelectedByAnotherClientRightCap] =
    useMemo(() => {
      if (isSelected || selectedByClientWithIndex === null) {
        return [false, false];
      }

      const left = index - 1;
      const right = index + 1;

      return [left, right].map(
        (testIndex) =>
          !isIndexInRange(
            otherSelections[otherClients[selectedByClientWithIndex].id],
            testIndex
          )
      );
    }, [
      otherSelections,
      isSelected,
      index,
      otherClients,
      selectedByClientWithIndex,
    ]);

  const confidence = useMemo(
    () => (isShowingConfidenceUnderlines ? word.confidence ?? 1 : 1),
    [isShowingConfidenceUnderlines, word]
  );

  return (
    <WordAndSpaceContainer
      key={`container-${word.originalIndex}-${word.pasteKey}`}
    >
      {word.deleted ? (
        <EditMarker
          key={`edit-marker-${word.originalIndex}-${word.pasteKey}`}
          word={word}
          prevWord={prevWord}
          nextWord={nextWord}
          index={index}
          isSelected={isSelected}
          selectedByClientWithIndex={selectedByClientWithIndex}
          popoverWidth={popoverWidth}
          transcriptionBlockRef={transcriptionBlockRef}
        />
      ) : (
        <Fragment key={`${word.originalIndex}-${word.pasteKey}`}>
          <WordSpace
            key={`space-${word.originalIndex}-${word.pasteKey}`}
            isBetweenHighlightedWords={isSelected && isPrevWordSelected}
            highlightedByClientWithIndex={
              isSelectedByAnotherClientLeftCap
                ? null
                : selectedByClientWithIndex
            }
          />
          <WordComponent
            text={word.word}
            bufferedDuration={bufferedWordDuration(word)}
            outputStartTime={word.outputStartTime}
            confidence={confidence}
            isBeingEdited={editWord?.index === index}
            editText={editWord?.text ?? null}
            isSelected={isSelected}
            isPrevWordSelected={isPrevWordSelected}
            isNextWordSelected={isNextWordSelected}
            selectedByClientWithIndex={selectedByClientWithIndex}
            isSelectedByAnotherClientLeftCap={isSelectedByAnotherClientLeftCap}
            isSelectedByAnotherClientRightCap={
              isSelectedByAnotherClientRightCap
            }
            index={index}
            key={`word-${word.originalIndex}-${word.pasteKey}`}
            isSelectedLeftCap={isSelected && !isPrevWordSelected}
            isSelectedRightCap={isSelected && !isNextWordSelected}
            partialSelectState={
              partialSelectState?.wordIndex === index
                ? partialSelectState
                : null
            }
            {...passThroughProps}
          />
          {index === transcriptionLength - 1 && (
            <WordSpace
              key="space-end"
              isBetweenHighlightedWords={false}
              highlightedByClientWithIndex={null}
            />
          )}
        </Fragment>
      )}
    </WordAndSpaceContainer>
  );
};

export default React.memo(WordOuterComponent);
