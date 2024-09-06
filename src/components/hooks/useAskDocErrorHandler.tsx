import { setFiles } from '../../store/slices/askDocAnalyzeFiesSlice';
import { setCreating } from '../../store/slices/tabSlice';
import { useAppDispatch } from '../../store/store';
import Bridge from '../../util/bridge';

import useModal from './askDoc/useModal';
type Props = {
  code: 'success' | 'fail';
  data: any;
};

const useAskDocErrorHandler = () => {
  const { openModal, closeModal } = useModal();
  const dispatch = useAppDispatch();

  const closeEvent = (
    type:
      | 'overpage'
      | 'remine'
      | 'samefile'
      | 'upgrade'
      | 'analyzefail'
      | 'uploadfail'
      | 'lackOfCredit'
      | 'default'
  ) => {
    Bridge.callBridgeApi('closePanel', 'shutDown');
    closeModal(type);
    dispatch(setCreating('none'));
    dispatch(
      setFiles({
        isLoading: true,
        files: [],
        userId: '',
        isSuccsess: false,
        fileStatus: null,
        maxFileRevision: 0,
        isInitialized: true
      })
    );
  };
  return (data: Props) => {
    if (data?.code === 'fail') {
      let type:
        | 'overpage'
        | 'remine'
        | 'samefile'
        | 'upgrade'
        | 'analyzefail'
        | 'uploadfail'
        | 'lackOfCredit'
        | 'default' = 'default';
      if (data.data.resultCode === 15002) type = 'lackOfCredit';
      if (data.data.resultCode === 15302) type = 'remine';
      if (data.data.resultCode === 15303) type = 'overpage';
      switch (type) {
        case 'lackOfCredit':
        case 'remine':
        case 'default':
        case 'overpage': {
          return openModal({
            type,
            props: {
              buttonOnclick: () => closeEvent(type)
            }
          });
        }
      }
    }

    return null;
  };
};

export default useAskDocErrorHandler;
