import { apiWrapper } from 'api/apiWrapper';
import { PO_DRIVE_LIST } from 'api/constant';
import { SUPPORT_FILE_TYPE } from 'pages/Nova/Nova';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getFileExtension } from 'util/common';

const Wrapper = styled.div`
  width: 100%;
  height: 270px;
  background-color: white;

  display: flex;
  flex-direction: column;
  overflow-y: auto;

  border: 1px solid #c9cdd2;
  border-radius: 8px;
`;

const FileItem = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 10px;
  ${({ selected }) => selected && 'background-color: green;'}
`;

export interface DriveFileInfo {
  fileId: string;
  fileName: string;
  fileType: 'DIR' | 'FILE';
  lastModified: number; //??
  size: number;

  name: string;
  type: string;
}

interface PoDriveProps {
  onChange: (file: DriveFileInfo) => void;
}

export default function PoDrive(props: PoDriveProps) {
  const [selected, setSelected] = useState<DriveFileInfo[]>([]);
  const [filelist, setFilelist] = useState<DriveFileInfo[]>([]);
  const getFileList = async (fileId?: DriveFileInfo['fileId']) => {
    try {
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
        .sort((l: DriveFileInfo, r: DriveFileInfo) =>
          l.fileType < r.fileType ? -1 : l.fileType > r.fileType ? 1 : 0
        )
        .map((item: DriveFileInfo) => ({
          ...item,
          name: item.fileName,
          type: SUPPORT_FILE_TYPE.find(
            (type) => type.extensions === getFileExtension(item.fileName)
          )?.mimeType
        }));
    } catch (err) {
      console.log(err);
      return []; // TODO : error handling
    }
  };

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
  }, []);

  return (
    <Wrapper>
      {filelist.map((item) => {
        return (
          <FileItem
            key={item.fileId}
            selected={selected.includes(item)}
            onClick={async () => {
              if (item.fileType === 'DIR') {
                moveFolder(item.fileId);
              } else if (item.fileType === 'FILE') {
                setSelected((prev) => [...prev, item]);
                props.onChange(item);
              }
            }}>
            <div>{item.fileType}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>{item.fileName}</div>
              <div>{item.fileId}</div>
            </div>
          </FileItem>
        );
      })}
    </Wrapper>
  );
}
