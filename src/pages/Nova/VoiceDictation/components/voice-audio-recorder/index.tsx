import voiceDictationHttp from 'api/voice-dictation';
import { setLocalFiles } from 'store/slices/uploadFiles';
import { useAppDispatch } from 'store/store';
import { blobToFile } from 'util/getAudioDuration';

import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';
import AudioRecorder from '../audio-recorder';

export default function VoiceAudioRecorder() {
  const { setSharedVoiceDictationInfo } = useVoiceDictationContext();
  const dispatch = useAppDispatch();

  const handleMoveToReady = async (file: File) => {
    console.log('file', file);
    dispatch(setLocalFiles([file]));

    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      componentType: 'VOICE_READY'
    }));
  };

  return (
    <AudioRecorder
      onRecordingComplete={async (blob) => {
        console.log('Recording completed:', blob);
        handleMoveToReady(blobToFile(blob));
      }}
    />
  );
}
