import { act, renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePicsumPhotoQuery', () => {
  const getPicsumPhotoListSpy = jest.fn();
  jest.doMock('./api', () => ({ getPicsumPhotoList: getPicsumPhotoListSpy }));

  const mockFirstPage = [
    { id: 1, name: 'test1' },
    { id: 2, name: 'test2' },
  ];

  const mockSecondPage = [
    { id: 3, name: 'test3' },
    { id: 4, name: 'test4' },
  ];

  const mockThirdPage = [
    { id: 3, name: 'test3' },
    { id: 4, name: 'test4' },
  ];

  const { usePicsumPhotoQuery } = require('./usePicsumPhotoQuery');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should usePicsumPhotoQuery query correctly', async () => {
    getPicsumPhotoListSpy.mockResolvedValueOnce(mockFirstPage);

    const { result, waitFor } = renderHook(() => usePicsumPhotoQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => result.current.isSuccess);

    expect(getPicsumPhotoListSpy).toBeCalledTimes(1);
    expect(getPicsumPhotoListSpy).toBeCalledWith(1);
    expect(result.current.data.pages).toStrictEqual([
      { result: mockFirstPage, nextPage: 2, totalPage: 3 },
    ]);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('should useAdHistoryQuery query correctly when fetch next page', async () => {
    getPicsumPhotoListSpy
      .mockResolvedValueOnce(mockFirstPage)
      .mockResolvedValueOnce(mockSecondPage)
      .mockResolvedValueOnce(mockThirdPage);

    const { result, waitFor } = renderHook(() => usePicsumPhotoQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data.pages).toStrictEqual([
      { result: mockFirstPage, nextPage: 2, totalPage: 3 },
    ]);

    result.current.fetchNextPage();

    await waitFor(() => {
      expect(getPicsumPhotoListSpy).toBeCalledTimes(2);
      expect(result.current.data.pages).toStrictEqual([
        { result: mockFirstPage, nextPage: 2, totalPage: 3 },
        { result: mockSecondPage, nextPage: 3, totalPage: 3 },
      ]);
      expect(result.current.hasNextPage).toBe(true);
    });

    result.current.fetchNextPage();

    await waitFor(() => {
      expect(getPicsumPhotoListSpy).toBeCalledTimes(3);
      expect(result.current.data.pages).toStrictEqual([
        { result: mockFirstPage, nextPage: 2, totalPage: 3 },
        { result: mockSecondPage, nextPage: 3, totalPage: 3 },
        { result: mockThirdPage, nextPage: 4, totalPage: 3 },
      ]);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  it('should usePicsumPhotoQuery query correctly when fetch failed', async () => {
    getPicsumPhotoListSpy.mockRejectedValueOnce(new Error());

    const { result, waitFor } = renderHook(() => usePicsumPhotoQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => result.current.isError);

    expect(result.current.data).toBeUndefined();
  });
});
