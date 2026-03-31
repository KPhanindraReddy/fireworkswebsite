export const createOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const randomBlock = Math.floor(1000 + Math.random() * 9000);
  return `FW-${timestamp}-${randomBlock}`;
};
