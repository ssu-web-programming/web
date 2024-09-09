import React from 'react';
import { ReactComponent as IconLogoNova } from 'img/ico_logo_nova.svg';
import { ReactComponent as IconMessagePlus } from 'img/ico_message_plus.svg';
import { ReactComponent as IconClose } from 'img/ico_nova_close.svg';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import ico_credit from '../../img/ico_credit_gray.svg';
import ico_credit_info from '../../img/ico_credit_line.svg';
import { creditInfoSelector, InitialState } from '../../store/slices/creditInfo';
import { novaHistorySelector } from '../../store/slices/novaHistorySlice';
import { setDriveFiles, setLocalFiles } from '../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Bridge, { ClientType, getPlatform } from '../../util/bridge';
import IconButton from '../buttons/IconButton';
import { useConfirm } from '../Confirm';
import { useChatNova } from '../hooks/useChatNova';
import Icon from '../Icon';
import Header from '../layout/Header';
import Tooltip from '../Tooltip';

import { ScreenChangeButton } from './ScreenChangeButton';

const flexCenter = css`
  display: flex;
  align-items: center;
`;

const StyledHeader = styled(Header)`
  width: 100%;
  color: var(--ai-purple-50-main);
`;

const TitleWrapper = styled.div`
  gap: 4px;

  img.nova {
    width: 55px;
    height: 16px;
  }

  ${flexCenter};
  flex-direction: row;
`;

const ButtonWrapper = styled.div`
  gap: 8px;

  ${flexCenter};
  flex-direction: row;
`;

export interface NovaHeaderProps {
  setInputContents?: React.Dispatch<React.SetStateAction<string>>;
}

export default function NovaHeader(props: NovaHeaderProps) {
  const { t } = useTranslation();
  const novaHistory = useAppSelector(novaHistorySelector);
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const creditInfo = useAppSelector(creditInfoSelector);

  const CREDIT_NAME_MAP: { [key: string]: string } = {
    NOVA_CHAT_GPT4O: t(`Nova.CreditInfo.Chat`),
    NOVA_ASK_DOC_GPT4O: t(`Nova.CreditInfo.DocImgQuery`),
    NOVA_IMG_GPT4O: t(`Nova.CreditInfo.ImgGen`)
  };

  const credit = filterCreditInfo(creditInfo, CREDIT_NAME_MAP);

  const TOOLTIP_CREDIT_OPTIONS = credit.map((item) => ({
    name: CREDIT_NAME_MAP[item.serviceType] || 'Unknown',
    icon: { src: ico_credit, txt: String(item.deductCredit) }
  }));

  const newChat = async () => {
    const ret = await confirm({
      title: t(`Nova.Confirm.NewChat.Title`)!,
      msg: t(`Nova.Confirm.NewChat.Msg`),
      onCancel: {
        text: t(`Cancel`)!,
        callback: () => {}
      },
      onOk: {
        text: t(`Nova.Confirm.NewChat.Ok`),
        callback: () => {}
      },
      direction: 'row'
    });

    if (ret) {
      await chatNova.newChat();
      if (props.setInputContents) props.setInputContents('');
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));
    }
  };

  return (
    <StyledHeader title="" subTitle="">
      <TitleWrapper>
        <IconLogoNova width={107} height={32} />
      </TitleWrapper>
      <ButtonWrapper>
        {novaHistory.length > 0 && (
          <IconButton
            iconComponent={IconMessagePlus}
            onClick={newChat}
            iconSize="lg"
            width={32}
            height={32}
          />
        )}
        <Tooltip
          title={t(`Nova.CreditInfo.Title`) as string}
          placement="bottom-end"
          type="normal"
          options={TOOLTIP_CREDIT_OPTIONS}>
          <Icon iconSrc={ico_credit_info} size={32} />
        </Tooltip>
        {getPlatform() !== ClientType.android && getPlatform() !== ClientType.ios && (
          <>
            <ScreenChangeButton></ScreenChangeButton>
            <IconButton
              iconComponent={IconClose}
              onClick={() => Bridge.callBridgeApi('closePanel')}
              iconSize="lg"
              width={32}
              height={32}
            />
          </>
        )}
      </ButtonWrapper>
    </StyledHeader>
  );
}

export const filterCreditInfo = (
  creditInfo: InitialState[],
  nameMap: { [key: string]: string }
) => {
  return creditInfo.filter((item) => nameMap[item.serviceType]);
};
