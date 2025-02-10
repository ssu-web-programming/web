import { useCallback, useState } from 'react';

interface PollingConfig<T, R, P> {
  // 초기 API 호출 함수 (ID를 반환하는 API)
  initialFn: (params: P) => Promise<T>;

  // 폴링 함수 (상태를 확인하는 API)
  pollingFn: (id: string) => Promise<R>;

  // ID를 추출하는 함수
  getPollingId: (response: T) => string;

  // 폴링 종료 조건을 확인하는 함수
  shouldContinue: (result: R) => boolean;

  // 폴링 간격 (ms)
  interval?: number;

  // 최대 시도 횟수
  maxAttempts?: number;

  // 초기 API 성공 시 콜백
  onInitialSuccess?: (result: T) => void;

  // 폴링 성공 시 콜백
  onPollingSuccess?: (result: R) => void;

  // 에러 발생 시 콜백
  onError?: (error: Error) => void;

  // 최대 시도 횟수 초과 시 콜백
  onMaxAttemptsReached?: () => void;
}

// polling status를 유연하게 바꿔보면 좋을 듯!
type PollingStatus =
  | 'idle'
  | 'initializing'
  | 'queued'
  | 'translating'
  | 'done'
  | 'error'
  | 'maxAttempts';

interface PollingState<T, R> {
  status: PollingStatus;
  initialData: T | null;
  pollingData: R | null;
  error: Error | null;
  attempts: number;
}

// T -> initialData , R -> pollingData , P -> initParams
// 호진 FIXME: 해당 컴포넌트 flexible하게 수정 필요!
export function usePolling<T, R, P>({
  initialFn,
  pollingFn,
  getPollingId,
  shouldContinue,
  interval = 3000,
  maxAttempts = 20,
  onInitialSuccess,
  onPollingSuccess,
  onError,
  onMaxAttemptsReached
}: PollingConfig<T, R, P>) {
  const [state, setState] = useState<PollingState<T, R>>({
    status: 'idle',
    initialData: null,
    pollingData: null,
    error: null,
    attempts: 0
  });

  const [pollingId, setPollingId] = useState<string | null>(null);

  const stop = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'idle' }));
    setPollingId(null);
  }, []);

  const startPolling = useCallback(
    async (id: string) => {
      let timeoutId: NodeJS.Timeout;

      const executePoll = async () => {
        try {
          if (state.attempts >= maxAttempts) {
            setState((prev) => ({ ...prev, status: 'maxAttempts' }));
            onMaxAttemptsReached?.();
            return;
          }

          const result = await pollingFn(id);

          setState((prev) => ({
            ...prev,
            pollingData: result,
            attempts: prev.attempts + 1
          }));

          console.log('executePoll-result', result);

          if (!shouldContinue(result)) {
            setState((prev) => ({ ...prev, status: 'done' }));
            onPollingSuccess?.(result);
            return;
          }

          timeoutId = setTimeout(executePoll, interval);
        } catch (error) {
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: error instanceof Error ? error : new Error(String(error))
          }));
          onError?.(error instanceof Error ? error : new Error(String(error)));
        }
      };

      setState((prev) => ({ ...prev, status: 'translating' }));
      executePoll();

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    },
    [
      state.attempts,
      pollingFn,
      shouldContinue,
      interval,
      maxAttempts,
      onPollingSuccess,
      onError,
      onMaxAttemptsReached
    ]
  );

  const start = useCallback(
    async (params: P) => {
      try {
        setState((prev) => ({
          ...prev,
          status: 'initializing',
          attempts: 0,
          error: null
        }));

        // 초기 API 호출
        const result = await initialFn(params);

        setState((prev) => ({
          ...prev,
          initialData: result
        }));

        onInitialSuccess?.(result);

        // ID 추출 및 폴링 시작
        const id = getPollingId(result);
        setPollingId(id);
        startPolling(id);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: error instanceof Error ? error : new Error(String(error))
        }));
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    },
    [initialFn, startPolling, onInitialSuccess, onError, getPollingId]
  );

  return {
    ...state,
    pollingId,
    start,
    stop,
    isInitializing: state.status === 'initializing',
    isPolling: state.status === 'translating'
  };
}
