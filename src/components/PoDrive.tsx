import { apiWrapper } from 'api/apiWrapper';
import { PO_DRIVE_LIST } from 'api/constant';
import { SUPPORT_DOCUMENT_TYPE, SUPPORT_IMAGE_TYPE } from 'pages/Nova/Nova';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getFileExtension } from 'util/common';
import { ReactComponent as IconRight } from 'img/angle_right.svg';
import file_loading from 'img/file_loading.svg';
import ico_file_folder from 'img/ico_file_folder.svg';
import ico_file_inbox from 'img/ico_file_inbox.svg';
import ico_file_poDrive from 'img/ico_file_po_drive.svg';
import { ReactComponent as IconUploadDocs } from 'img/ico_upload_docs.svg';
import { ReactComponent as IconUploadImg } from 'img/ico_upload_img.svg';
import CheckBox from './CheckBox';
import Icon from './Icon';
import { MAX_FILE_UPLOAD_SIZE_MB } from './nova/InputBar';
import { CustomScrollbar } from 'style/cssCommon';
import { getFileIcon } from './nova/InputBar';
import { useAppDispatch } from 'store/store';
import { activeToast } from 'store/slices/toastSlice';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  width: 100%;
  min-width: 295px;
  height: 270px;
  box-sizing: border-box;
  background-color: white;

  display: flex;
  flex-direction: column;

  border: 1px solid #c9cdd2;
  border-radius: 8px;
  overflow: hidden;
`;

const Navi = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;

  border-bottom: 1px solid #c9cdd2;
  padding: 16px;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;

  svg {
    width: 16px;
    height: 16px;
  }

  .currentDir {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

const FileList = styled.div`
  width: 100%;

  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden auto;
  padding: 0px 24px;
  position: relative;

  ${CustomScrollbar}
`;

const FileItem = styled.div`
  width: 100%;
  min-width: 247px;
  height: 68px;
  min-height: 68px;

  display: flex;
  flex-direction: row;

  justify-content: flex-start;
  align-items: center;

  & + & {
    border-top: 1px solid #e8ebed;
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .info {
    width: 100%;
    overflow: hidden;
    margin-left: 10px;
    .name {
      font-weight: 400;
      font-size: 16px;
      letter-spacing: -0.02em;

      margin-bottom: 4px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .createdAt {
      font-weight: 400;
      font-size: 12px;
      color: var(--gray-gray-60-03);

      svg {
        margin-left: 8px;
      }
    }
  }
`;

const NoFile = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;

  span {
    color: var(--gray-gray-60-03);
    font-size: 14px;
    line-height: 21px;
  }
`;

export interface DriveFileInfo {
  fileId: string;
  fileName: string;
  fileRevision: number;
  fileType: 'DIR' | 'FILE';
  lastModified: number; //??
  size: number;

  name: string;
  type: string;
}

interface PoDriveProps {
  max: number;
  onChange: (files: DriveFileInfo[]) => void;
  target: string;
}

export default function PoDrive(props: PoDriveProps) {
  const [selected, setSelected] = useState<DriveFileInfo[]>([]);
  const [state, setState] = useState<'none' | 'request'>('request');
  const [filelist, setFilelist] = useState<DriveFileInfo[]>([]);
  const [navi, setNavi] = useState<DriveFileInfo[]>([
    {
      fileId: '',
      fileName: 'drive',
      fileRevision: 0,
      fileType: 'DIR',
      lastModified: 0,
      size: 0,
      name: '',
      type: ''
    }
  ]);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const getFileList = async (fileId?: DriveFileInfo['fileId']) => {
    try {
      setState('request');
      const { res } = await apiWrapper().request(PO_DRIVE_LIST, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ fileId: fileId })
      });

      const {
        success,
        data: { list }
      } = await res.json();
      if (!success) throw new Error('failed to get file list');
      return list
        .filter((item: DriveFileInfo) => item.size <= MAX_FILE_UPLOAD_SIZE_MB * 1024 * 1024)
        .sort((l: DriveFileInfo, r: DriveFileInfo) =>
          l.fileType < r.fileType ? -1 : l.fileType > r.fileType ? 1 : 0
        )
        .map((item: DriveFileInfo) => {
          const ext = getFileExtension(item.fileName).toLowerCase();
          const supports =
            props.target === 'nova-image' ? SUPPORT_IMAGE_TYPE : SUPPORT_DOCUMENT_TYPE;
          const type = supports.find((type) => type.extensions === ext)?.mimeType;

          return {
            ...item,
            name: item.fileName,
            type: type
          };
        })
        .filter((item: DriveFileInfo) => item.fileType === 'DIR' || !!item.type);
    } catch (err) {
      console.log(err);
      return []; // TODO : error handling
    } finally {
      setState('none');
    }
  };

  const getDirIcon = (dir: DriveFileInfo) => {
    const name = dir.fileName;
    const fileType = dir.fileType;

    if (name === 'drive') return ico_file_poDrive;
    if (name === 'Inbox') return ico_file_inbox;
    if (fileType === 'DIR') return ico_file_folder;
  };

  const getIcons = useCallback((drive: DriveFileInfo) => {
    switch (drive.fileType) {
      case 'DIR':
        return <Icon size={24} iconSrc={getDirIcon(drive)} />;
      case 'FILE': {
        return <Icon size={24} iconSrc={getFileIcon(drive.fileName)} />;
      }
    }
  }, []);

  const moveFolder = async (fileId: DriveFileInfo['fileId']) => {
    const list = await getFileList(fileId);
    setFilelist(list);
  };

  const initFileList = async () => {
    const list = await getFileList();
    setFilelist(list);
  };

  useEffect(() => {
    initFileList();
    dispatch(
      activeToast({
        type: 'info',
        msg: t(props.target === 'nova-file' ? 'Nova.Toast.SelectDoc' : 'Nova.Toast.SelectImg')
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBack = () => {
    const index = navi.length - 1;
    if (index === 0) return;
    setNavi((prev) => prev.slice(0, index));
    moveFolder(navi[index - 1].fileId);
  };

  return (
    <Wrapper>
      <Navi>
        {navi.length > 1 && (
          <IconRight
            style={{
              width: '12px',
              minWidth: '12px',
              height: '24px',
              transform: 'rotate(180deg)',
              cursor: 'pointer'
            }}
            onClick={onBack}
          />
        )}
        <Icon size={24} iconSrc={getDirIcon(navi[navi.length - 1])} />
        <div className="currentDir">
          {navi[navi.length - 1].fileName === 'drive'
            ? t('Nova.UploadTooltip.PolarisDrive')
            : navi[navi.length - 1].fileName}
        </div>
      </Navi>
      <FileList>
        {state === 'none' &&
          filelist.map((item) => {
            const date = new Date(item.lastModified * 1000);
            return (
              <FileItem
                key={item.fileId}
                onClick={async () => {
                  if (item.fileType === 'DIR') {
                    moveFolder(item.fileId);
                    setNavi((prev) => [...prev, item]);
                  } else if (item.fileType === 'FILE') {
                    if (selected.includes(item)) {
                      const sel = selected.filter((prevItem) => prevItem !== item);
                      setSelected(sel);
                      props.onChange(sel);
                    } else {
                      const sel = [...selected, item].slice(props.max * -1);
                      setSelected(sel);
                      props.onChange(sel);
                    }
                  }
                }}>
                <div className="icon">{getIcons(item)}</div>
                <div className="info">
                  <div className="name">{item.fileName}</div>
                  <div className="createdAt">{`${date.toLocaleString()}`}</div>
                </div>
                {item.fileType === 'FILE' && (
                  <CheckBox
                    isChecked={selected.includes(item)}
                    setIsChecked={() => {}}
                    onClick={() => {}}></CheckBox>
                )}
              </FileItem>
            );
          })}

        {state === 'none' && filelist.length === 0 && (
          <NoFile>
            {props.target === 'nova-file' ? (
              <IconUploadDocs width={56} height={56} color="var(--gray-gray-40)" />
            ) : (
              <IconUploadImg width={56} height={56} color="var(--gray-gray-40)" />
            )}
            <span>
              {t('Nova.PoDrive.NoFile', {
                type: t(`${props.target === 'nova-file' ? 'document' : 'image'}`)
              })}
            </span>
          </NoFile>
        )}

        {state === 'request' && (
          <img
            src={file_loading}
            alt="loading"
            style={{ display: 'block', position: 'absolute', top: 0, left: 0 }}
          />
        )}
      </FileList>
    </Wrapper>
  );
}
