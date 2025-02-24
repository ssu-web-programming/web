import { apiWrapper } from 'api/apiWrapper';
import {
  NOVA_TRANSLATE_DOCUMENT,
  NOVA_TRANSLATE_DOCUMENT_CHECK_STATUS,
  NOVA_TRANSLATE_LATEST_LANG,
  NOVA_TRANSLATE_TEXT,
  PO_DRIVE_DOC_OPEN_STATUS
} from 'api/constant';

interface PostTranslateText {
  text: string;
  sourceLang?: string;
  targetLang: string;
}

export interface PostTranslateDocument {
  file: File;
  sourceLang?: string;
  targetLang: string;
}

export interface TranslateDocumentResponse {
  translateId: string;
}

export interface CheckTranslateStatusResponse {
  status: string;
  secondsRemaining: number;
  downloadUrl: string;
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
    if (!response.success) {
      throw response.error;
    }

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

    const response = await res.json();
    if (!response.success) {
      throw response.error;
    }

    return response.data;
  },
  postCheckTranslateStatus: async ({ translateId }: { translateId: string }) => {
    const { res } = await apiWrapper().request(NOVA_TRANSLATE_DOCUMENT_CHECK_STATUS, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ translateId })
    });

    const response = await res.json();
    if (!response.success) {
      throw response.error;
    }

    return response.data;
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
    if (!response.success) {
      throw response.error;
    }

    return response;
  },
  postCheckOpenStatus: async ({ fileId, fileRevision }: any) => {
    const { res } = await apiWrapper().request(PO_DRIVE_DOC_OPEN_STATUS, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileId, fileRevision }),
      method: 'POST'
    });
    const response = await res.json();
    if (!response.success) {
      throw response.error;
    }

    console.log('response', response);
    return response;
  }
};

export default translationHttp;
