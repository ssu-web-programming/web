import { apiWrapper } from 'api/apiWrapper';
import {
  NOVA_TRANSLATE_DOCUMENT,
  NOVA_TRANSLATE_LATEST_LANG,
  NOVA_TRANSLATE_TEXT
} from 'api/constant';

interface PostTranslateText {
  text: string;
  sourceLang?: string;
  targetLang: string;
}

interface PostTranslateDocument {
  file: File;
  sourceLang?: string;
  targetLang: string;
}

const translationHttp = {
  postTranslateText: async ({ text, sourceLang, targetLang }: PostTranslateText) => {
    const { res } = await apiWrapper().request(NOVA_TRANSLATE_TEXT, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, sourceLang, targetLang }),
      method: 'POST'
    });

    const response = await res.json();
    return { response: response.data, headers: res.headers };
  },
  postTranslateDocument: async ({ file, sourceLang, targetLang }: PostTranslateDocument) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sourceLang', sourceLang || '');
    formData.append('targetLang', targetLang);

    const { res } = await apiWrapper().request(NOVA_TRANSLATE_DOCUMENT, {
      method: 'POST',
      body: formData
    });

    const contentType = res.headers.get('Content-Type');

    if (contentType?.includes('application/json')) {
      const errorResponse = await res.json();
      console.error('Translation failed:', errorResponse);
      throw errorResponse;
    } else if (contentType?.includes('application/octet-stream')) {
      const blob = await res.blob();
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = 'translated_document';

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/);
        if (filenameMatch) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      return {
        success: true,
        filename,
        blob
      };
    }

    throw new Error('Unexpected response type');
  },
  postTranslateLatestLang: async () => {
    const { res } = await apiWrapper().request(NOVA_TRANSLATE_LATEST_LANG, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
      method: 'POST'
    });
    const response = await res.json();

    return response;
  }
};

export default translationHttp;
