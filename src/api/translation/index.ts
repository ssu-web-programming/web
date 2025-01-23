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
    console.log('response', response);
    return response.data;
  },
  postTranslateDocument: async ({ file, sourceLang, targetLang }: PostTranslateDocument) => {
    const { res } = await apiWrapper().request(NOVA_TRANSLATE_DOCUMENT, {
      headers: {
        'Content-Type': 'mulitpart/form-data'
      },
      body: JSON.stringify({ file, sourceLang, targetLang }),
      method: 'POST'
    });

    const response = await res.json();
    console.log('response', response);
    return response;
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
    console.log('response', response);
    return response;
  }
};

export default translationHttp;
