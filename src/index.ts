import { Lexer } from "./lexer/Lexer";
import { Parser } from "./parser/Parser";
import { TTPError } from "./parser/Error";
import { Generator } from "./generators/Generator";
import { SyntaxBuilder } from "./parser/SyntaxBuilder";

import { Ok, Err, Result } from "optionem";

export function generateTruthTable(
  input: string
): Result<object[], TTPError[]> {
  const builder = new SyntaxBuilder();
  const parser = new Parser(builder);
  const lexer = new Lexer(parser);
  const generator = new Generator(builder.getTTP());

  lexer.lex(input);

  const errors = generator.getErrors();

  if (errors.length === 0) {
    return new Ok(generator.generate());
  }

  return new Err(errors);
}
