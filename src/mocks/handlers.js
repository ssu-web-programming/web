import { http, HttpResponse, delay } from 'msw';
const encoder = new TextEncoder();
export const handlers = [
  http.post('/api/1/ai/askdoc/getAnalyzeInfo', async ({ request }) => {
    const { fileId, fileRevision } = await request.json();

    //현재 리비전이 최신 리비전일 때
    if (fileRevision === 1) {
      return HttpResponse.json({
        resultCode: 0,
        fileId,
        fileRevision,
        maxFileRevision: fileRevision,
        timaAnalyze: 123123,
        status: null
      });
    } else {
      return HttpResponse.json({
        resultCode: 0,
        fileId,
        fileRevision,
        maxFileRevision: 4,
        timaAnalyze: 123123,
        status: 'DOCINFO_DONE'
      });
    }
  }),
  http.post('/api/1/ai/askdoc/extracttext', async () => {
    //문서 분석 API
    await delay(3000);

    return HttpResponse.json({
      resultCode: 0,
      resultMsg: 'success',
      taskId: '1'
    });
  }),
  http.post('/api/1/ai/askdoc/extracttext/status', async () => {
    let count = 0;
    //문서 분석 API
    await delay();

    while (count < 2) {
      count++;
      HttpResponse.json({
        resultCode: 0,
        resultMsg: 'success',
        status: 'in_progress'
      });
    }

    return HttpResponse.json({
      resultCode: 0,
      resultMsg: 'success',
      status: 'completed'
    });
  }),
  http.post('/api/1/ai/askdoc/createVectorData', async () => {
    //문서 분석 API
    await delay(3000);

    return HttpResponse.json({
      resultCode: 0,
      resultMsg: 'success',
      status: 'DOCINFO_DONE'
    });
  }),
  http.post('/api/1/ai/askdoc/makeSummary', async () => {
    //키워드 요약, 추천 질문 추출
    await delay(2000);
    return HttpResponse.json({
      resultCode: 0,
      resultMsg: 'success',
      summary:
        '이 문서는 2023년 인터넷 쇼핑의 형태와 구매 여정에 대한 분석 보고서입니다. 인터넷 쇼핑의 영향력, 쇼핑몰 사이트의 겨쟁력 등을 다루고 있으며, 모바일 성장과 PC 인터넷 쇼핑몰 영향력 변화에 대한 내용도 포함되어 잇습니다.',
      keywords: ['쇼핑', '영향력', '경쟁력', '인터넷', '네이버 쇼핑', '쿠팡'],
      questions: [
        '인터넷 쇼핑 형태는 어떻게 달라졌나요?',
        '모바일 쇼핑은 얼마나 성장했나요?',
        '구매 여정의 변화는 있었나요?'
      ],
      status: 'USERCREDIT_REQUIRED'
    });
  }),
  http.post('/api/1/ai/askdoc/preAsk', async () => {
    //문서 분석 전체 완료 API
    await delay(3000);
    return HttpResponse.json({
      resultCode: 0,
      resultMsg: 'success',
      status: 'AVAILABLE'
    });
  }),
  http.post('/api/1/ai/askdoc/ask', () => {
    //질의 API
    const data =
      '이 문서는 2023년 인터넷 쇼핑의 형태와 구매 여정에 대한 분석 보고서입니다. 인터넷 쇼핑의 영향력, 쇼핑몰 사이트의 겨쟁력 등을 다루고 있으며, 모바일 성장과 PC 인터넷 쇼핑몰 영향력 변화에 대한 내용도 포함되어 잇습니다.';
    const stream = new ReadableStream({
      start(controller) {
        for (let x of data) {
          controller.enqueue(encoder.encode(x));
          console.log(encoder.encode(x));
        }
        controller.close();
      }
    });

    const result = new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    console.log(result);
  })
];
