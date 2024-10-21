import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { ReactComponent as CloseIcon } from '../img/ico_nova_close.svg';
import { announceInfoSelector, setAnnounceInfo } from '../store/slices/nova/announceSlice';
import { selectTabSlice } from '../store/slices/tabSlice';
import { useAppSelector } from '../store/store';

const AnnouncementWrap = styled.div`
  width: 100%;
  height: fit-content;
  position: sticky;
  top: 0;
  padding: 0 16px;
  pointer-events: all;
  margin-bottom: 40px;
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
  content: string;
}

export default function Announcement(props: AnnouncementProps) {
  const { content } = props;
  const dispatch = useDispatch();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const announceInfo = useAppSelector(announceInfoSelector(selectedNovaTab));

  return (
    <AnnouncementWrap>
      <Content>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <CloseIcon
          onClick={() => {
            dispatch(setAnnounceInfo({ tab: selectedNovaTab, info: { ...announceInfo } }));
          }}
        />
      </Content>
    </AnnouncementWrap>
  );
}
