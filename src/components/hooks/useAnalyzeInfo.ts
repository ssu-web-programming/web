import { useEffect, useState } from 'react';

interface IResponseFile {
  resultCode: number;
  resultMsg: string;
  fileId: string;
  fileRevision: number;
  maxFileRevision: number;
  timeAnalyze: number;
  status: string;
  summary: string;
  keywords: string[];
  questions: string[];
  preQuestion: string;
  preAnswer: string;
}

function useAnalyzeInfo(fileId: string, fileRevision: number) {
  const [data, setData] = useState<IResponseFile[]>([]);

  const getAnalyzeInfo = async () => {
    const res = await fetch(`${process.env.REACT_APP_API}/1/ai/askdoc/getAnalyzeInfo`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        fileId: fileId,
        fileRevision: fileRevision
      })
    });
    setData(await res.json());
  };

  useEffect(() => {
    getAnalyzeInfo();
  }, []);

  return data;
}

export default useAnalyzeInfo;
