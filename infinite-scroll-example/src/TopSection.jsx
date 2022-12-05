import React from 'react';
import { usePicsumPhotoQuery } from './usePicsumPhotoQuery';

const TopSection = () => {
  const { data } = usePicsumPhotoQuery();

  const page = data ? data.pages.length : 0;
  const totalCurrentItem = data
    ? data.pages.reduce(
        (initial, current) => initial + current.result.length,
        0
      )
    : 0;

  return (
    <div className="top-section">
      <div>page: {page}</div>
      <div>total current items: {totalCurrentItem}</div>
    </div>
  );
};

export default TopSection;
