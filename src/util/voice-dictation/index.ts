import type { Segments } from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';
import { formatMilliseconds } from 'util/getAudioDuration';

export const parseJsonToText = (segments: Segments[]): string => {
  // 1. segments를 시간순으로 정렬
  const sortedSegments = [...segments].sort((a, b) => a.end - b.end);

  // 2. 각 segment를 포맷팅된 문자열로 변환
  const formattedText = sortedSegments
    .map((segment) => {
      const speaker = `참석자 ${segment.speaker.name}`;
      const endTime = formatMilliseconds(segment.end);
      const text = segment.text.trim();

      return `[${speaker}] ${endTime}\n${text}\n`;
    })
    .join('\n');

  return formattedText;
};
