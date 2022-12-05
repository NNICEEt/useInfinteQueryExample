import React, { useRef } from 'react';

import InfiniteScroll from 'react-infinite-scroller';
import { usePicsumPhotoQuery } from './usePicsumPhotoQuery';

const InfiniteScrollerSection = () => {
  const scrollRef = useRef();

  const { data, hasNextPage, fetchNextPage, isLoading } = usePicsumPhotoQuery();

  return (
    <div className="infinite-scroll" ref={scrollRef}>
      {isLoading ? (
        <div>Loading...</div>
      ) : !data ? (
        <div>No data...</div>
      ) : (
        <InfiniteScroll
          loadMore={() => fetchNextPage()}
          getScrollParent={() => scrollRef.current}
          loader={<div key="loader">Loading...</div>}
          useWindow={!scrollRef.current}
          hasMore={hasNextPage}
        >
          {data.pages.map((page) =>
            page.result.map((item) => (
              <div className="item" key={item.id}>
                {item.author}
              </div>
            ))
          )}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default InfiniteScrollerSection;
