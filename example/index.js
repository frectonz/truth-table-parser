const { generateTruthTable } = require("TTP");
const { createInterface } = require("readline");

const readLine = createInterface({
  input: process.stdin,
  output: process.stdout,
});

readLine.question("> ", (input) => {
  const { result, errors } = generateTruthTable(input);
  console.log(result, errors);
  readLine.close();
});
