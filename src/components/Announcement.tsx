import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { ReactComponent as CloseIcon } from '../img/light/ico_nova_close.svg';
import {
  announceInfoSelector,
  IAnnouceInfo,
  setAnnounceInfo
} from '../store/slices/nova/announceSlice';
import { novaChatModeSelector } from '../store/slices/nova/novaHistorySlice';
import { selectPageService } from '../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../store/slices/tabSlice';
import { useAppSelector } from '../store/store';

const AnnouncementWrap = styled.div`
  width: 100%;
  height: fit-content;
  position: sticky;
  margin-top: 16px;
  padding: 0 16px;
  pointer-events: all;
  background-color: transparent;
`;

const Content = styled.div`
  position: relative;
  padding: 16px 32px 16px 16px;
  background-color: #feeeee;
  border-radius: 12px;

  div {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #26282b;

    b {
      font-size: 14px;
      font-weight: 700;
    }

    span {
      font-size: 14px;
      font-weight: 400;
    }
  }

  svg {
    position: absolute;
    top: 8px;
    right: 8px;
  }
`;

interface AnnouncementProps {
  announcement: IAnnouceInfo;
}

export default function Announcement(props: AnnouncementProps) {
  const { announcement } = props;
  const dispatch = useDispatch();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const service = useAppSelector(selectPageService(selectedNovaTab));
  const announcementList = useAppSelector(announceInfoSelector);

  return (
    <AnnouncementWrap>
      <Content>
        <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
        <CloseIcon
          onClick={() => {
            const updatedAnnouncements = announcementList.map((item) =>
              service.some((s) => s.serviceType === item.type) ||
              (selectedNovaTab === NOVA_TAB_TYPE.home && item.type === 'PO_NOVA_MAIN')
                ? { ...item, isShow: false }
                : item
            );
            dispatch(setAnnounceInfo(updatedAnnouncements));
          }}
        />
      </Content>
    </AnnouncementWrap>
  );
}
