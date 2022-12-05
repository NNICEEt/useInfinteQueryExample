import { useInfiniteQuery } from '@tanstack/react-query';
import { getPicsumPhotoList } from './api';

export const usePicsumPhotoQuery = () => {
  return useInfiniteQuery(
    ['pagination'],
    async ({ pageParam = 1 }) => {
      const data = await getPicsumPhotoList(pageParam);

      return { result: data, nextPage: pageParam + 1, totalPage: 3 };
    },
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.nextPage <= lastPage.totalPage ? lastPage.nextPage : undefined,
    }
  );
};
