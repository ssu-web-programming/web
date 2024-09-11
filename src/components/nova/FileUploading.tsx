import { ReactComponent as AgentFraphicEn } from 'img/agent_graphic_en.svg';
import { ReactComponent as AgentFraphicJa } from 'img/agent_graphic_ja.svg';
import { ReactComponent as AgentFraphicKo } from 'img/agent_graphic_ko.svg';
import { ReactComponent as IconArrowLeft } from 'img/ico_arrow_left.svg';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { FileUpladState } from '../../constants/fileTypes';
import { lang } from '../../locale';
import IconButton from '../buttons/IconButton';

const FileUploadWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: absolute;
  left: 0;
  top: 0;
  background-color: white;

  .header {
    height: 56px;
    display: flex;
    flex-direction: row;
    padding: 12px 16px;
    align-items: center;

    .empty {
      height: inherit;
    }
  }

  .contents {
    padding: 40px 24px;

    .title {
      height: 24px;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
    }

    .desc {
      height: 108px;
      margin-top: 12px;
      font-weight: 700;
      font-size: 24px;
      line-height: 36px;
    }
  }

  .agentImage {
    display: flex;
    justify-content: center;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 4px;
  padding: 0px;
  background-color: #6f3ad0;
`;

interface FileUploadingProps extends FileUpladState {
  onClickBack: () => void;
  progress: number;
}

export const FileUploading = (props: FileUploadingProps) => {
  const { type, state, progress, onClickBack } = props;
  const { t } = useTranslation();
  if (state === 'ready') return null;

  const AgentFraphic =
    lang === 'ko' ? AgentFraphicKo : lang === 'ja' ? AgentFraphicJa : AgentFraphicEn;

  return (
    <FileUploadWrapper>
      <div className="header">
        {state === 'upload' ? (
          <IconButton
            iconComponent={IconArrowLeft}
            width={32}
            height={32}
            onClick={onClickBack}></IconButton>
        ) : (
          <div className="empty"></div>
        )}
      </div>
      <div>
        <ProgressBar progress={progress}></ProgressBar>
      </div>
      <div className="contents">
        <div className="title">{t(`Nova.UploadState.Uploading`, { type: t(type) })}</div>
        <div className="desc">
          {state === 'upload'
            ? t(`Nova.UploadState.${state}_${type}`)
            : t(`Nova.UploadState.${state}`)}
        </div>
      </div>
      <div className="agentImage">
        <AgentFraphic></AgentFraphic>
      </div>
    </FileUploadWrapper>
  );
};
