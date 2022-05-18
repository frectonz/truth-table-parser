import { Lexer } from "./lexer/Lexer";
import { Parser } from "./parser/Parser";
import { Generator } from "./generators/Generator";
import { SyntaxBuilder } from "./parser/SyntaxBuilder";
import { TTPError } from "./parser/Error";

export function generateTruthTable(input: string): {
  result: object | null;
  errors: TTPError[];
} {
  const builder = new SyntaxBuilder();
  const parser = new Parser(builder);
  const lexer = new Lexer(parser);

  const generator = new Generator(builder.getTTP());

  lexer.lex(input);

  const errors = generator.getErrors();
  let result: object | null = null;

  if (errors.length === 0) {
    result = generator.generate();
    return {
      errors,
      result,
    };
  }

  return {
    errors,
    result: null,
  };
}
