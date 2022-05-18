const { generateTruthTable } = require("../dist/index");
const repl = require("repl");

repl.start({
  prompt: "> ",
  eval: (cmd, _, __, callback) => {
    try {
      const { result, errors } = generateTruthTable(cmd);

      if (result) {
        console.table(result);
        return callback(null, "OK");
      }

      if (errors.length !== 0) {
        errors.forEach((error) => console.error(error.msg));
        return callback(null, "ERROR");
      }
    } catch (e) {
      callback(e);
    }
  },
});
