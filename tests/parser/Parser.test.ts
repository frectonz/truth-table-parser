import { Lexer } from "../../src/lexer/Lexer";
import { ErrorType } from "../../src/parser/Error";
import { Parser } from "../../src/parser/Parser";
import { SyntaxBuilder } from "../../src/parser/SyntaxBuilder";

describe("Parser Test", () => {
  let lexer: Lexer;
  let parser: Parser;
  let builder: SyntaxBuilder;
  beforeEach(() => {
    builder = new SyntaxBuilder();
    parser = new Parser(builder);
    lexer = new Lexer(parser);
  });

  const assertParseResult = (input: string, expected: string) => {
    lexer.lex(input);
    parser.parse();
    expect(expected).toBe(builder.getTTP().toString());
  };

  const assertErrorResult = (input: string, expected: ErrorType) => {
    lexer.lex(input);
    parser.parse();
    expect(
      builder.getTTP().errors.filter((error) => error.type === expected)
        .length > 0
    ).toBe(true);
  };

  describe("Propositions", () => {
    test("Single Proposition", () => {
      assertParseResult("p", "p");
    });

    test("Single Proposition With Negation", () => {
      assertParseResult("!p", "!p");
    });

    test("Compound Proposition", () => {
      assertParseResult("p & q", "(p&q)");
    });

    test("Compound Proposition With Negation", () => {
      assertParseResult("(!p) & (!q)", "(!p&!q)");
    });
    test("Compound Proposition With Outer Negation", () => {
      assertParseResult("!(p & q)", "!(p&q)");
    });

    test("Compound Proposition With Parens", () => {
      assertParseResult("(p => q)", "(p=>q)");
    });

    test("Compound Proposition Without Outer Parens", () => {
      assertParseResult("(p => q) & (p | q)", "((p=>q)&(p|q))");
    });

    test("Compound Proposition With Outer Parens", () => {
      assertParseResult("((p => q) & (p | q))", "((p=>q)&(p|q))");
    });
  });

  describe("Errors", () => {
    test("Syntax Error", () => {
      assertErrorResult(".", ErrorType.SYNTAX);
    });

    test("Variable Error", () => {
      assertErrorResult("p(", ErrorType.VARIABLE);
    });

    test("Proposition Error", () => {
      assertErrorResult(")", ErrorType.PROPOSITION);
    });

    test("Binary Connective Error", () => {
      assertErrorResult("p && q", ErrorType.BINARY);
    });

    test("Unary Connective Error", () => {
      assertErrorResult("!)", ErrorType.UNARY);
    });
  });
});
