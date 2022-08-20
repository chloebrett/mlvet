import {
  Dispatch,
  ReactElement,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { RuntimeProject } from 'sharedTypes';
import { bufferedWordDuration } from 'sharedUtils';
import { VideoPreviewControllerRef } from '../VideoPreview/VideoPreviewController';

type ChildFunction = (
  time: number,
  setTime: Dispatch<SetStateAction<number>>,
  isPlaying: boolean,
  setIsPlaying: Dispatch<SetStateAction<boolean>>,
  nowPlayingWordIndex: number,
  play: () => void,
  pause: () => void,
  seekForward: () => void,
  seekBack: () => void,
  seekToWord: (wordIndex: number) => void
) => ReactElement;

interface Props {
  videoPreviewControllerRef: RefObject<VideoPreviewControllerRef>;
  currentProject: RuntimeProject | null;
  children: ChildFunction;
}

const PlaybackManager = ({
  videoPreviewControllerRef,
  currentProject,
  children,
}: Props) => {
  // UI states
  const [time, setTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlayingWordIndex, setNowPlayingWordIndex] = useState<number>(0);

  const play = () => videoPreviewControllerRef?.current?.play();
  const pause = () => videoPreviewControllerRef?.current?.pause();
  const setPlaybackTime = (newPlaybackTime: number) =>
    videoPreviewControllerRef?.current?.setPlaybackTime(newPlaybackTime);
  const seekForward = () => videoPreviewControllerRef?.current?.seekForward();
  const seekBack = () => videoPreviewControllerRef?.current?.seekBack();

  // TODO: Look into optimisations
  useEffect(() => {
    if (currentProject === null || currentProject?.transcription === null) {
      return;
    }

    const newPlayingWordIndex = currentProject.transcription.words.findIndex(
      (word) =>
        time >= word.outputStartTime &&
        time < word.outputStartTime + bufferedWordDuration(word) &&
        !word.deleted
    );

    if (newPlayingWordIndex !== nowPlayingWordIndex) {
      setNowPlayingWordIndex(newPlayingWordIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, currentProject?.transcription]);

  const seekToWord: (wordIndex: number) => void = (wordIndex) => {
    if (currentProject !== null && currentProject?.transcription !== null) {
      // Fixes some minor floating point errors that cause the previous word to be selected
      // instead of the current one
      const epsilon = 0.01;

      const newTime =
        currentProject.transcription.words[wordIndex].outputStartTime + epsilon;
      setPlaybackTime(newTime);
    }
  };

  return children(
    time,
    setTime,
    isPlaying,
    setIsPlaying,
    nowPlayingWordIndex,
    play,
    pause,
    seekForward,
    seekBack,
    seekToWord
  );
};

export default PlaybackManager;
