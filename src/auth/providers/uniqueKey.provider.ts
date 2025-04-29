export const generateUniqueKey = (length = 5): string => {
  let key = '';
  for (let i = 0; i < length; i++) {
    key += Math.floor(Math.random() * 10);
  }
  return key;
};
