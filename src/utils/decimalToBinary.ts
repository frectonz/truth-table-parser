export const decimalToBinary = (num: number, size: number) => {
  const binaryList = [];
  while (num > 0) {
    binaryList.push(num % 2);
    num = Math.floor(num / 2);
  }
  binaryList.reverse();

  if (binaryList.length < size) {
    const paddingZeros = Math.abs(binaryList.length - size);
    for (let i = 0; i < paddingZeros; i++) {
      binaryList.unshift(0);
    }
  }

  return binaryList;
};
