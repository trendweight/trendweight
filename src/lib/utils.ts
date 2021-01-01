export const toJson = (object: unknown) => {
  return JSON.stringify(object, undefined, 2);
};
