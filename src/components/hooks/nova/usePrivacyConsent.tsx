import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { selectTabSlice } from '../../../store/slices/tabSlice';
import { userInfoSelector } from '../../../store/slices/userInfo';
import { useAppSelector } from '../../../store/store';
import { useConfirm } from '../../Confirm';

import useNovaAgreement from './useNovaAgreement';

const PersonalInfoContents = styled.div`
  text-align: left;
  font-size: 15px;
  letter-spacing: -0.3px;
`;

const usePrivacyConsent = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { setIsAgreed } = useNovaAgreement();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);

  const Msg = () => {
    const chatRetention = t('Index.Confirm.PersonalInfo.ChatRetention');
    const fileRetention = t('Index.Confirm.PersonalInfo.FileRetention');

    const msg1 = t('Index.Confirm.PersonalInfo.Msg1');
    const msg2 = t('Index.Confirm.PersonalInfo.Msg2', {
      chatRetention,
      fileRetention
    });
    const msg3 = t('Index.Confirm.PersonalInfo.Msg3');
    const msg = `${msg1}\n\n${msg2}\n\n${msg3}`;
    const splitMsg = msg.split('\n');

    const boldText = (line: string) => {
      const mappings = [
        { key: chatRetention, highlight: <strong>{chatRetention}</strong> },
        { key: fileRetention, highlight: <strong>{fileRetention}</strong> }
      ];

      for (const { key, highlight } of mappings) {
        if (line.includes(key)) {
          const [before, after] = line.split(key);

          return (
            <div>
              {before}
              {highlight}
              {after}
            </div>
          );
        }
      }

      return (
        <div>
          {line}
          <br />
        </div>
      );
    };

    return (
      <PersonalInfoContents>
        {splitMsg.map((line, idx) => (
          <div key={idx}>{boldText(line)}</div>
        ))}
      </PersonalInfoContents>
    );
  };

  const handleOnClick = () => {
    if (!isAgreed) {
      setIsAgreed(true);
    }
  };

  const handleAgreement = async () => {
    if (selectedNovaTab !== 'aiChat' || isAgreed === true) return true;
    if (isAgreed === undefined) return false;

    const isConfirmed = await confirm({
      title: t(`Nova.Confirm.PersonalInfo.Title`)!,
      msg: <Msg />,
      onCancel: {
        text: t(`Nova.Confirm.PersonalInfo.Cancel`),
        callback: () => {}
      },
      onOk: {
        text: t(`Nova.Confirm.PersonalInfo.Ok`),
        callback: () => {}
      },
      direction: 'row'
    });

    if (isConfirmed) handleOnClick();

    return isConfirmed;
  };

  return { handleAgreement };
};

export default usePrivacyConsent;
