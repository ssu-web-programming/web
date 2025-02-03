import VoiceDictationContent from './components/voice-dictation-content';
import VoiceDictationProvider from './provider/voice-dictation-provider';

export default function VoiceDictation() {
  return (
    <VoiceDictationProvider>
      <VoiceDictationContent />
    </VoiceDictationProvider>
  );
}
