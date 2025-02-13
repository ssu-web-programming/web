import { apiWrapper } from 'api/apiWrapper';
import { NOVA_SPEECH_DOWNLOAD, NOVA_SPEECH_RECOGNIZE } from 'api/constant';

interface PostSpeechRecognize {
  file: File;
}

interface PostVoiceDownload {
  file: File;
  requestId: string;
  fileType: 'txt' | 'pdf';
}

const voiceDictationHttp = {
  postSpeechRecognize: async ({ file }: PostSpeechRecognize) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', 'ko-KR');

    const { res } = await apiWrapper().request(NOVA_SPEECH_RECOGNIZE, {
      method: 'POST',
      body: formData
    });

    const response = await res.json();

    console.log('voice-response', response);
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
