import { apiWrapper } from 'api/apiWrapper';
import { NOVA_SPEECH_DOWNLOAD, NOVA_SPEECH_RECOGNIZE } from 'api/constant';
import { LangOptionValues } from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';
import { v4 } from 'uuid';

import { NOVA_TAB_TYPE } from '../../constants/novaTapTypes';
import { getServiceLoggingInfo, SERVICE_TYPE } from '../../constants/serviceType';
import { CurrentFileInfo, getCurrentFile } from '../../store/slices/uploadFiles';
import { useAppSelector } from '../../store/store';
import { calLeftCredit } from '../../util/common';

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

    const { res, logger } = await apiWrapper().request(
      NOVA_SPEECH_RECOGNIZE,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: formData
      },
      { name: NOVA_TAB_TYPE.voiceDictation, uuid: v4() }
    );

    const response = await res.json();

    if (!response.success) {
      throw response.error;
    }

    const log_info = getServiceLoggingInfo(SERVICE_TYPE.NOVA_SPEECH_RECOGNITION_CLOVA);
    await logger({
      dp: 'ai.nova',
      el: log_info.name,
      gpt_ver: log_info.detail
    });

    return { result: response, headers: res.headers };
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

    return response;
  }
};

export default voiceDictationHttp;
