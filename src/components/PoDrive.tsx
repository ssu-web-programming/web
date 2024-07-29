import { apiWrapper } from 'api/apiWrapper';
import { PO_DRIVE_LIST } from 'api/constant';
import { SUPPORT_DOCUMENT_TYPE, SUPPORT_IMAGE_TYPE } from 'pages/Nova/Nova';
import { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { getFileExtension } from 'util/common';

import { ReactComponent as IconFolder } from 'img/folder.svg';
import { ReactComponent as IconFile } from 'img/mailbox.svg';
import { ReactComponent as IconImage } from 'img/landscape.svg';
import { ReactComponent as IconCloud } from 'img/cloud.svg';
import { ReactComponent as IconRight } from 'img/angle_right.svg';
import CheckBox from './CheckBox';
import { MAX_FILE_UPLOAD_SIZE_MB } from './nova/InputBar';
import { CustomScrollbar } from 'style/cssCommon';

const Wrapper = styled.div<{ disabled: boolean }>`
  width: 100%;
  height: 270px;
  background-color: white;

  display: flex;
  flex-direction: column;

  border: 1px solid #c9cdd2;
  border-radius: 8px;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}
`;

const Navi = styled.div`
  width: 100%;
  height: 56px;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  border-bottom: 1px solid #c9cdd2;
  padding: 16px;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;

  svg {
    width: 16px;
    height: 16px;

    margin-right: 8px;
  }
`;

const FileList = styled.div`
  width: 100%;

  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  padding: 0px 24px;

  ${CustomScrollbar}
`;

const FileItem = styled.div`
  width: 100%;
  height: 68px;
  min-height: 68px;

  display: flex;
  flex-direction: row;
  gap: 10px;

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
    .name {
      font-weight: 400;
      font-size: 16px;
      line-height: 16px;

      margin-bottom: 4px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .createdAt {
      font-weight: 400;
      font-size: 12px;
      line-height: 12px;

      color: #9ea4aa;

      svg {
        margin-left: 8px;
      }
    }
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
  const [state, setState] = useState<'none' | 'request'>('request');
  const [selected, setSelected] = useState<DriveFileInfo[]>([]);
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
          const ext = getFileExtension(item.fileName);
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

  const getIcons = useCallback((drive: DriveFileInfo) => {
    switch (drive.fileType) {
      case 'DIR':
        return <IconFolder />;
      case 'FILE': {
        if (SUPPORT_IMAGE_TYPE.find((type) => type.mimeType === drive.type)) return <IconImage />;
        return <IconFile />;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper disabled={state === 'request'}>
      <Navi>
        <IconFolder></IconFolder>
        {navi.map((item, index) => {
          return (
            <>
              <div
                onClick={() => {
                  const index = navi.findIndex((nav) => nav.fileId === item.fileId);
                  setNavi((prev) => prev.slice(0, index + 1));
                  moveFolder(item.fileId);
                }}>
                {item.fileName}
              </div>
              {index !== navi.length - 1 && (
                <IconRight style={{ width: '10px', height: '16px', margin: '0px 5px' }}></IconRight>
              )}
            </>
          );
        })}
      </Navi>
      <FileList>
        {filelist.map((item) => {
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
                <div className="createdAt">
                  {`${date.toLocaleString()}`}
                  <IconCloud></IconCloud>
                </div>
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
      </FileList>
    </Wrapper>
  );
}
