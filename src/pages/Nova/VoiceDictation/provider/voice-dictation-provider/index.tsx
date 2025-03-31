import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { useConfirm } from 'components/Confirm';
import { useTranslation } from 'react-i18next';
import { formatDuration, getAudioDurationViaWebAudioAPI } from 'util/getAudioDuration';

export type VoiceDictationComponentType =
  | 'INTRO'
  | 'LOADING'
  | 'AUDIO_RECORDER'
  | 'VOICE_READY'
  | 'FILE_READY'
  | 'RESULT';

export interface Segments {
  confidence: number;
  diarization: {
    label: string;
  };
  end: number;
  speaker: {
    edited: boolean;
    label: string;
    name: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  };
  start: number;
  text: string;
  words: [number, number, string][];
}

export interface VoiceDictationResult {
  success: boolean;
  data: {
    segments: Segments[];
    requestId: string;
    voiceUrl: string;
  };
}

export type LangOptionValues = 'ko-KR' | 'en-US' | 'enko' | 'ja' | 'zh-cn' | 'zh-tw';

interface Props {
  children: ReactNode;
}

interface SharedVoiceDictationInfo {
  componentType: VoiceDictationComponentType;
  voiceDictationResult: VoiceDictationResult | null;
  audioDuration: string;
  isVoiceRecording: boolean;
  previousPageType: 'OPEN_TAB' | 'AUDIO_RECORDER' | null;
  selectedLangOption: LangOptionValues;
  fileName: string;
  currentTime: string;
  voiceFile: File | null;
}

interface VoiceDictationContextType {
  sharedVoiceDictationInfo: SharedVoiceDictationInfo;
  setSharedVoiceDictationInfo: Dispatch<SetStateAction<SharedVoiceDictationInfo>>;
  triggerLoading: () => void;
  resetVoiceInfo: () => void;
  handleAudioDuration: (file: File) => Promise<void>; // 추가
  moveToFileReady: () => void; // 추가
}

export const VoiceDictationContext = createContext<VoiceDictationContextType | null>(null);

export const useVoiceDictationContext = () => {
  const context = useContext(VoiceDictationContext);

  if (!context) throw new Error('VoiceDictation must be used within a TranslationProvider');

  return context;
};

export default function VoiceDictationProvider({ children }: Props) {
  const confirm = useConfirm();
  const { t } = useTranslation();

  const [sharedVoiceDictationInfo, setSharedVoiceDictationInfo] =
    useState<SharedVoiceDictationInfo>({
      componentType: 'INTRO',
      voiceDictationResult: null,
      audioDuration: '',
      isVoiceRecording: false,
      previousPageType: null,
      selectedLangOption: 'ko-KR',
      fileName: '',
      currentTime: '',
      voiceFile: null
    });

  const triggerLoading = () => {
    setSharedVoiceDictationInfo({
      ...sharedVoiceDictationInfo,
      componentType: 'LOADING'
    });
  };

  const resetVoiceInfo = () => {
    setSharedVoiceDictationInfo({
      componentType: 'INTRO',
      voiceDictationResult: null,
      audioDuration: '',
      isVoiceRecording: false,
      previousPageType: null,
      selectedLangOption: 'ko-KR',
      fileName: '',
      currentTime: '',
      voiceFile: null
    });
  };

  // 새로 추가하는 함수들
  const handleAudioDuration = async (file: File) => {
    try {
      const duration = await getAudioDurationViaWebAudioAPI(file);
      console.log('duration settings', duration);

      if (duration) {
        setSharedVoiceDictationInfo((prev) => ({
          ...prev,
          audioDuration: formatDuration(duration),
          fileName: file.name, // 파일 이름도 함께 저장
          componentType: 'FILE_READY'
        }));
      } else {
        await confirm({
          msg: t('Nova.voiceDictation.Alert.ConfirmCorrectAudio')
        });
      }
    } catch (e) {
      await confirm({
        msg: t('Nova.voiceDictation.Alert.ConfirmCorrectAudio')
      });
    }
  };

  const moveToFileReady = () => {
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      componentType: 'FILE_READY'
    }));
  };

  return (
    <VoiceDictationContext.Provider
      value={{
        sharedVoiceDictationInfo,
        setSharedVoiceDictationInfo,
        triggerLoading,
        resetVoiceInfo,
        handleAudioDuration, // 새로 추가한 함수
        moveToFileReady // 새로 추가한 함수
      }}>
      {children}
    </VoiceDictationContext.Provider>
  );
}
