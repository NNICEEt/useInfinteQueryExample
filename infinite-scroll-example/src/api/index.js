export const getPicsumPhotoList = async (page) => {
  const res = await fetch(
    `https://picsum.photos/v2/list?page=${page}&limit=20`
  );

  return res.json();
};
