import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_GET_LINK_REFERENCE } from '../../../../api/constant';
import { appendChatReferences } from '../../../../store/slices/nova/novaHistorySlice';

const useGetChatReferences = () => {
  const dispatch = useDispatch();

  const getReferences = useCallback(
    async (citations: string[], id: string) => {
      if (citations.length === 0) return;

      try {
        const { res } = await apiWrapper().request(NOVA_GET_LINK_REFERENCE, {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ urls: citations }),
          method: 'POST'
        });

        const response = await res.json();

        if (response.success && Array.isArray(response.data)) {
          const references = response.data.map(
            (item: {
              data: {
                success: boolean;
                site_name: string;
                title: string;
                description: string;
                type: string;
                url: string;
              };
              url: string;
            }) => ({
              site: item.data.site_name || '',
              title: item.data.title || '',
              desc: item.data.description,
              type: item.data.type || '',
              url: item.url || '',
              favicon: item.url
                ? `https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}`
                : ''
            })
          );

          dispatch(
            appendChatReferences({
              id,
              references
            })
          );
        }
      } catch (error) {
        console.error('Error fetching references:', error);
      }
    },
    [dispatch]
  );

  return { getReferences };
};

export default useGetChatReferences;
