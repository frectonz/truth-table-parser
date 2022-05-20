#!/usr/bin/env node

const repl = require("repl");
const { printTable } = require("console-table-printer");
const { generateTruthTable } = require("../dist/index");

repl.start({
  prompt: "> ",
  eval: (cmd, _, __, callback) => {
    try {
      const result = generateTruthTable(cmd);

      result.match({
        Ok(map) {
          printTable(map);
          callback(null, "OK");
        },
        Err(errors) {
          errors.forEach((error) => console.error(error.msg));
          callback(null, "ERROR");
        },
      });
    } catch (e) {
      callback(e);
    }
  },
});
