const { generateTruthTable } = require("../dist/index");
const { createInterface } = require("readline");

const readLine = createInterface({
  input: process.stdin,
  output: process.stdout,
});

readLine.question("> ", (input) => {
  const { result, errors } = generateTruthTable(input);
  console.table(result);
  errors.length !== 0 && console.error(errors);
  readLine.close();
});
