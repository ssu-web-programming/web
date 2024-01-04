import useModal from './useModal';
import { openNewWindow } from '../../util/common';
import Bridge from '../../util/bridge';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { filesSelector, setFileStatus, setFiles } from '../../store/slices/askDocAnalyzeFiesSlice';
import { setCreating } from '../../store/slices/tabSlice';
import useLangParameterNavigate from './useLangParameterNavigate';
type Props = {
  code: 'success' | 'fail';
  data: any;
};

const useAskDocErrorHandler = () => {
  const { openModal, closeModal } = useModal();
  const { navigate } = useLangParameterNavigate();
  const dispatch = useAppDispatch();
  const file = useAppSelector(filesSelector);

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
          return openModal({
            type,
            props: {
              leftButtonOnClick: () => {
                openNewWindow('upgradePlan');
                closeModal(type);
                navigate('/AskDocStep/StartAnalysisDoc');
                dispatch(setCreating('none'));
                dispatch(setFileStatus({ ...file, fileStatus: 'TEXT_DONE' }));
              },
              rightButtonOnClick: () => closeEvent(type)
            }
          });
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
