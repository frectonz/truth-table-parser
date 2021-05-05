import { decimalToBinary } from "../../src/utils/decimalToBinary";

const assertDecimalToBinary = (input: [number, number], expected: string) => {
  expect(expected).toBe(
    decimalToBinary(input[0], input[1]).map(String).join("")
  );
};

test("Decimal to Binary", () => {
  assertDecimalToBinary([0, 4], "0000");
  assertDecimalToBinary([1, 4], "0001");
  assertDecimalToBinary([2, 4], "0010");
  assertDecimalToBinary([3, 4], "0011");
  assertDecimalToBinary([4, 4], "0100");
  assertDecimalToBinary([5, 4], "0101");
  assertDecimalToBinary([6, 4], "0110");
  assertDecimalToBinary([7, 4], "0111");
  assertDecimalToBinary([8, 4], "1000");
  assertDecimalToBinary([9, 4], "1001");
  assertDecimalToBinary([10, 4], "1010");
});
