import { ReactComponent as DarkPause } from 'img/dark/nova/voice-dictation/pause.svg';
import { ReactComponent as DarkPlay } from 'img/dark/nova/voice-dictation/play.svg';
import { ReactComponent as Pause } from 'img/light/nova/voiceDictation/pause.svg';
import { ReactComponent as Play } from 'img/light/nova/voiceDictation/play.svg';

import ControlButton from '../control-button';

interface PlayPauseButtonProps {
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export default function PlayPauseButton({ isPaused, onPlay, onPause }: PlayPauseButtonProps) {
  return (
    <ControlButton
      icon={isPaused ? Play : Pause}
      darkIcon={isPaused ? DarkPlay : DarkPause}
      onClick={isPaused ? onPlay : onPause}
    />
  );
}
