import { apiWrapper } from 'api/apiWrapper';
import { NOVA_SPEECH_RECOGNIZE } from 'api/constant';

interface PostSpeechRecognize {
  file: File;
}

const voiceDictationHttp = {
  postSpeechRecognize: async ({ file }: PostSpeechRecognize) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', 'KO');

    const { res } = await apiWrapper().request(NOVA_SPEECH_RECOGNIZE, {
      method: 'POST',
      body: formData
    });

    const response = await res.json();
    return response;
  }
};

export default voiceDictationHttp;
