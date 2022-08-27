import { IndexRange, Word } from 'sharedTypes';
import { mapInRanges } from '../../sharedUtils';

interface InjectableTake {
  wordRange: IndexRange;
}

interface InjectableTakeGroup {
  takes: InjectableTake[];
}

const mockTakeGroups: InjectableTakeGroup[] = [
  {
    takes: [
      { wordRange: { startIndex: 0, endIndex: 3 } },
      { wordRange: { startIndex: 3, endIndex: 6 } },
      { wordRange: { startIndex: 6, endIndex: 10 } },
    ],
  },
];

const injectMockTakeInfo = (words: Word[]) => {
  let wordsCopy = [...words];

  const takeGroups = mockTakeGroups.map((takeGroup, takeGroupIndex) => ({
    id: takeGroupIndex,
    activeTakeIndex: 0,
    takeCount: takeGroup.takes.length,
  }));

  mockTakeGroups.forEach((takeGroup, takeGroupIndex) => {
    takeGroup.takes.forEach((take, takeIndex) => {
      const { wordRange } = take;

      wordsCopy = mapInRanges(
        wordsCopy,
        (word) => ({
          ...word,
          takeInfo: { takeGroupId: takeGroupIndex, takeIndex },
        }),
        [wordRange]
      );
    });
  });

  return {
    words: wordsCopy,
    takeGroups,
  };
};

export default injectMockTakeInfo;
