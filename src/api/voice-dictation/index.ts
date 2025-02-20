import { apiWrapper } from 'api/apiWrapper';
import { NOVA_SPEECH_DOWNLOAD, NOVA_SPEECH_RECOGNIZE } from 'api/constant';
import { LangOptionValues } from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';

interface PostSpeechRecognize {
  file: File;
  lang: LangOptionValues;
}

interface PostVoiceDownload {
  file: File;
  requestId: string;
  fileType: 'txt' | 'pdf';
}

const voiceDictationHttp = {
  postSpeechRecognize: async ({ file, lang }: PostSpeechRecognize) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', lang);

    const { res } = await apiWrapper().request(NOVA_SPEECH_RECOGNIZE, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: formData
    });

    const response = await res.json();

    if (!response.success) {
      throw response.error;
    }

    return response;
  },
  postVoiceDownload: async ({ file, fileType, requestId }: PostVoiceDownload) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    formData.append('requestId', requestId);

    const { res } = await apiWrapper().request(NOVA_SPEECH_DOWNLOAD, {
      method: 'POST',
      body: formData
    });

    const response = await res.json();

    console.log('postVoiceDownload-response', response);
    return response;
  }
};

export default voiceDictationHttp;
