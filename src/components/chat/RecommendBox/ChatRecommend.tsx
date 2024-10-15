import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { FlattenSimpleInterpolation } from 'styled-components';

import icon_ai from '../../../img/ico_ai.svg';
import { ReactComponent as IconArrowDown } from '../../../img/ico_arrow_down_small.svg';
import { ReactComponent as IconArrowUp } from '../../../img/ico_arrow_up_small.svg';
import {
  closeRecFunc,
  initRecFunc,
  openRecFunc,
  recSubType,
  recType,
  selectRecFunc,
  selectRecFuncSlice,
  selectSubRecFunc
} from '../../../store/slices/recFuncSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  alignItemCenter,
  flex,
  flexColumn,
  flexWrap,
  justiCenter,
  justiSpaceBetween
} from '../../../style/cssCommon';
import IconButton from '../../buttons/IconButton';
import Icon from '../../Icon';

import FormRec, { DEFAULT_WRITE_OPTION_FORM_VALUE } from './FormRec';
import FunctionRec from './FunctionRec';

const Wrapper = styled.div`
  ${flex}
  ${flexColumn}
  ${justiCenter}

  width: 100%;
  background-color: rgba(245, 241, 253, 0.7);
  box-shadow: 0 -2px 8px 0 rgba(111, 58, 208, 0.3);
  border-radius: 10px 10px 0px 0px;
  padding: 16px;
  border-top: solid 1px #fff;

  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);

  div {
    backdrop-filter: none;
  }
`;

export const RowWrapBox = styled.div<{ cssExt?: FlattenSimpleInterpolation }>`
  ${flex}
  ${flexWrap}
  ${justiSpaceBetween}
  ${alignItemCenter}

  width: 100%;
  ${(props) => (props.cssExt ? props.cssExt : '')};
`;

const OpenedBox = styled(RowWrapBox)`
  max-height: 138px;
  overflow-y: auto;
  padding-top: 16px;
`;

const CommentWrapper = styled.div`
  ${flex}
  ${justiCenter}
  ${alignItemCenter}
  ${justiCenter}
  align-self: center;

  width: fit-content;
  line-height: 100%;
  font-size: 13px;
  color: var(--gray-gray-90-01);
`;

const CommentFlip = ({
  comment,
  onClick,
  icon
}: {
  comment: string;
  onClick: () => void;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}) => {
  return (
    <CommentWrapper>
      <Icon iconSrc={icon_ai} size="md" />
      <span style={{ display: 'flex', margin: '0px 4px 0px 6px' }}>{comment}</span>
      <IconButton iconComponent={icon} iconSize="sm" onClick={onClick} />
    </CommentWrapper>
  );
};

const ChatRecommend = ({ isFormRec }: { isFormRec: boolean }) => {
  const dispatch = useAppDispatch();
  const { selectedRecFunction, selectedSubRecFunction, isOpen } =
    useAppSelector(selectRecFuncSlice);
  const { t } = useTranslation();

  const [isSubPage, setIsSubPage] = useState<boolean>(false);

  const setSelectedFunc = (func: recType | null) => {
    dispatch(selectRecFunc(func));
  };

  const setSelectedSubFunc = (func: recSubType | null) => {
    dispatch(selectSubRecFunc(func));
  };

  const resetAll = () => {
    dispatch(initRecFunc());
  };

  const checkSameId = (selectedId: string | undefined, clickId: string): boolean => {
    if (!selectedId || selectedId !== clickId) return false;
    return true;
  };

  useEffect(() => {
    if (isFormRec) setSelectedFunc({ id: DEFAULT_WRITE_OPTION_FORM_VALUE.id, subList: null });
  }, [isFormRec]);

  return (
    <Wrapper>
      <CommentFlip
        comment={isFormRec ? t(`ChatingTab.UseVariableForm`) : t(`ChatingTab.UseMoreAI`)}
        icon={isOpen ? IconArrowDown : IconArrowUp}
        onClick={() => {
          if (isOpen) dispatch(closeRecFunc());
          else dispatch(openRecFunc());
        }}
      />
      {isOpen && (
        <OpenedBox>
          {isFormRec ? (
            <FormRec
              onClick={(rec: recSubType) =>
                setSelectedFunc({ id: rec.id, icon: rec.icon, subList: null })
              }
              selectedRecFunction={selectedRecFunction}
            />
          ) : (
            <FunctionRec
              isSubPage={isSubPage}
              onClick={(rec: recType) => {
                if (rec.subList) setIsSubPage(true);

                setSelectedFunc(checkSameId(selectedRecFunction?.id, rec.id) ? null : rec);
                setSelectedSubFunc(null);
              }}
              onSubClick={(sub: string) => {
                setSelectedSubFunc(
                  checkSameId(selectedSubRecFunction?.id, sub) ? null : { id: sub }
                );
              }}
              onClickBack={() => {
                setIsSubPage(false);
                resetAll();
              }}
            />
          )}
        </OpenedBox>
      )}
    </Wrapper>
  );
};

export default ChatRecommend;
