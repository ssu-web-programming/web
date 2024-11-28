import { useCallback, useEffect, useState } from 'react';
import CheckBox from 'components/CheckBox';
import useManageFile from 'components/hooks/nova/useManageFile';
import useUserInfoUtils from 'components/hooks/useUserInfoUtils';
import Icon from 'components/Icon';
import { getFileIcon } from 'components/nova/InputBar';
import Select from 'components/select';
import { getMaxFileSize } from 'constants/fileTypes';
import { ReactComponent as IconRight } from 'img/angle_right.svg';
import ico_file_folder from 'img/ico_file_folder.svg';
import ico_file_inbox from 'img/ico_file_inbox.svg';
import ico_file_poDrive from 'img/ico_file_po_drive.svg';
import { ReactComponent as IconUploadDocs } from 'img/ico_upload_docs.svg';
import { ReactComponent as IconUploadImg } from 'img/ico_upload_img.svg';
import { useTranslation } from 'react-i18next';
import { NOVA_TAB_TYPE, selectTabSlice } from 'store/slices/tabSlice';
import { activeToast } from 'store/slices/toastSlice';
import { DriveFileInfo } from 'store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from 'store/store';

import LoadingSpinner from '../../img/spinner.webp';

import * as S from './style';

type OptionValues = 'latest' | 'oldest' | 'name_asc' | 'name_desc' | 'size_desc' | 'size_asc';

type Option = {
  value: OptionValues;
  label: string;
};

const options: Option[] = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된 순' },
  { value: 'name_asc', label: '이름 오름차순' },
  { value: 'name_desc', label: '이름 내림차순' },
  { value: 'size_desc', label: '파일 크기 큰 순' },
  { value: 'size_asc', label: '파일 크기 작은 순' }
];

interface PoDriveProps {
  max: number;
  target: string;
  selectedFiles: DriveFileInfo[];
  handleSelectedFiles: (selectedFiles: DriveFileInfo[]) => void;
  isSingleFileSelection: boolean;
}

export default function PoDrive(props: PoDriveProps) {
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
  const { getFileList } = useManageFile();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const { getMaxFilesPerUpload } = useUserInfoUtils();
  const [selectedOption, setSelectedOption] = useState<OptionValues>('latest');

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
    const list = await getFileList({ target: props.target, setState: setState, fileId: fileId });
    const sortedResult = sortedFileList(selectedOption, list);

    setFilelist(sortedResult!);
  };

  const initFileList = async () => {
    const list = await getFileList({ target: props.target, setState: setState });
    setFilelist(sortedLatestOrOldestFileList('latest', list));
  };

  const onBack = () => {
    const index = navi.length - 1;
    if (index === 0) return;
    setNavi((prev) => prev.slice(0, index));
    moveFolder(navi[index - 1].fileId);
  };

  const getTranslationKey = (): string => {
    if (selectedNovaTab === NOVA_TAB_TYPE.aiChat) {
      return 'Nova.PoDrive.LimitDesc';
    } else {
      return 'Nova.PoDrive.Desc';
    }
  };

  const sortedLatestOrOldestFileList = (type: 'latest' | 'oldest', files?: DriveFileInfo[]) => {
    const targetFileList = files || filelist;

    return targetFileList.sort((a, b) => {
      if (a.fileName === 'Inbox') return -1;
      if (b.fileName === 'Inbox') return 1;

      if (a.fileType !== b.fileType) return a.fileType === 'DIR' ? -1 : 1;

      const sortOrder = type === 'oldest' ? 1 : -1;
      return (a.lastModified - b.lastModified) * sortOrder;
    });
  };

  const sortedNameAscOrDescFileList = (type: 'name_asc' | 'name_desc', files?: DriveFileInfo[]) => {
    const targetFileList = files || filelist;

    return targetFileList.sort((a, b) => {
      if (a.fileName === 'Inbox') return -1;
      if (b.fileName === 'Inbox') return 1;

      if (a.fileType !== b.fileType) return a.fileType === 'DIR' ? -1 : 1;

      const sortOrder = type === 'name_desc' ? 1 : -1;
      return a.fileName.localeCompare(b.fileName, 'ko') * sortOrder;
    });
  };

  const sortedSizeAscOrDescFileList = (type: 'size_asc' | 'size_desc', files?: DriveFileInfo[]) => {
    const targetFileList = files || filelist;

    return targetFileList.sort((a, b) => {
      if (a.fileName === 'Inbox') return -1;
      if (b.fileName === 'Inbox') return 1;

      if (a.fileType !== b.fileType) return a.fileType === 'DIR' ? -1 : 1;

      const sortOrder = type === 'size_asc' ? 1 : -1;
      return (a.size - b.size) * sortOrder;
    });
  };

  const sortedFileList = (value: OptionValues, files?: DriveFileInfo[]) => {
    if (value === 'latest' || value === 'oldest') {
      return sortedLatestOrOldestFileList(value, files);
    }

    if (value === 'name_asc' || value === 'name_desc') {
      return sortedNameAscOrDescFileList(value, files);
    }

    if (value === 'size_asc' || value === 'size_desc') {
      return sortedSizeAscOrDescFileList(value, files);
    }
  };

  const handleChangeOption = (value: OptionValues) => {
    // 최신 오래된 순 정렬은 lastModified
    // 이름 오름차순은 fileName
    // 파일 크기순 size
    sortedFileList(value);
    setSelectedOption(value);
  };

  useEffect(() => {
    initFileList();
    dispatch(
      activeToast({
        type: 'info',
        msg: t(props.target === 'nova-file' ? 'Nova.Toast.SelectDoc' : 'Nova.Toast.SelectImg')
      })
    );
  }, []);

  return (
    <S.Wrapper>
      <S.Navi>
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

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
            <Icon size={24} iconSrc={getDirIcon(navi[navi.length - 1])} />
            <div className="currentDir">
              {navi[navi.length - 1].fileName === 'drive'
                ? t('Nova.UploadTooltip.PolarisDrive')
                : navi[navi.length - 1].fileName}
            </div>
          </div>
          <div>
            <Select<OptionValues>
              options={options}
              value={selectedOption}
              onChange={handleChangeOption}
              width="120px"
            />
          </div>
        </div>
      </S.Navi>
      <S.SubTitle>
        {t(getTranslationKey(), {
          size: getMaxFileSize(selectedNovaTab),
          count: getMaxFilesPerUpload(selectedNovaTab)
        })}
      </S.SubTitle>
      <S.FileList>
        {state === 'none' &&
          filelist?.map((item) => {
            const date = new Date(item.lastModified * 1000);
            return (
              <S.FileItem
                key={item.fileId}
                onClick={async () => {
                  if (item.fileType === 'DIR') {
                    moveFolder(item.fileId);
                    setNavi((prev) => [...prev, item]);
                  } else if (item.fileType === 'FILE') {
                    if (props.isSingleFileSelection) {
                      if (!props.selectedFiles.includes(item)) {
                        props.handleSelectedFiles([item]);
                      }
                    } else {
                      if (props.selectedFiles.includes(item)) {
                        const sel = props.selectedFiles.filter((prevItem) => prevItem !== item);
                        props.handleSelectedFiles(sel);
                      } else {
                        const sel = [...props.selectedFiles, item].slice(props.max * -1);
                        props.handleSelectedFiles(sel);
                      }
                    }
                  }
                }}>
                <S.ItemWrapper>
                  <div className="icon">{getIcons(item)}</div>
                  <div className="info">
                    <div className="name">{item.fileName}</div>
                    <div className="createdAt">{`${date.toLocaleString()}`}</div>
                  </div>
                  {item.fileType === 'FILE' && (
                    <CheckBox
                      isChecked={props.selectedFiles.includes(item)}
                      setIsChecked={() => {}}
                      onClick={() => {}}></CheckBox>
                  )}
                </S.ItemWrapper>
              </S.FileItem>
            );
          })}

        {state === 'none' && filelist?.length === 0 && (
          <S.NoFile>
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
          </S.NoFile>
        )}

        {state === 'request' && (
          <S.SpinnerWrapper>
            <Icon iconSrc={LoadingSpinner} size={50} />
          </S.SpinnerWrapper>
        )}
      </S.FileList>
    </S.Wrapper>
  );
}
