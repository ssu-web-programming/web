import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { ReactComponent as CloseIcon } from '../img/ico_nova_close.svg';
import { announceInfoSelector, setAnnounceInfo } from '../store/slices/nova/announceSlice';
import { selectTabSlice } from '../store/slices/tabSlice';
import { useAppSelector } from '../store/store';

const AnnouncementWrap = styled.div`
  width: 100%;
  height: fit-content;
  padding: 0 16px;
  pointer-events: all;
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
  const text =
    '<b>현재 기능이 일시적으로 중단되었습니다</b><span>빠른 시일 내에 문제를 해결해, 더 나은 서비스로 보답하겠습니다. 감사합니다.</span>';
  return (
    <>
      <AnnouncementWrap>
        <Content>
          <div dangerouslySetInnerHTML={{ __html: text }} />
          <CloseIcon
            onClick={() => {
              console.log('set false');
              dispatch(
                setAnnounceInfo({ tab: selectedNovaTab, info: { ...announceInfo, isShow: false } })
              );
            }}
          />
        </Content>
      </AnnouncementWrap>
    </>
  );
}
