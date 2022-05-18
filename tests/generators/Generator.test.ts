import { Lexer } from "../../src/lexer/Lexer";
import { Parser } from "../../src/parser/Parser";
import { Generator } from "../../src/generators/Generator";
import { SyntaxBuilder } from "../../src/parser/SyntaxBuilder";

describe("Generator Tests", () => {
  let lexer: Lexer;
  let parser: Parser;
  let generator: Generator;
  let builder: SyntaxBuilder;
  beforeEach(() => {
    builder = new SyntaxBuilder();
    parser = new Parser(builder);
    lexer = new Lexer(parser);
    generator = new Generator(builder.getTTP());
  });

  const assertGeneratorResult = (input: string, expected: object) => {
    lexer.lex(input);
    const output = generator.generate();
    expect(output).toStrictEqual(expected);
  };

  describe("Propositions", () => {
    test("Single Proposition", () => {
      assertGeneratorResult("p", { p: ["T", "F"], result: ["T", "F"] });
    });

    test("Single Proposition With Negation", () => {
      assertGeneratorResult("!p", { p: ["T", "F"], result: ["F", "T"] });
    });

    test("Compound Proposition With And", () => {
      assertGeneratorResult("p & q", {
        p: ["T", "T", "F", "F"],
        q: ["T", "F", "T", "F"],
        result: ["T", "F", "F", "F"],
      });
    });

    test("Compound Proposition With Or", () => {
      assertGeneratorResult("p | q", {
        p: ["T", "T", "F", "F"],
        q: ["T", "F", "T", "F"],
        result: ["T", "T", "T", "F"],
      });
    });

    test("Compound Proposition With Implication", () => {
      assertGeneratorResult("p => q", {
        p: ["T", "T", "F", "F"],
        q: ["T", "F", "T", "F"],
        result: ["T", "F", "T", "T"],
      });
    });

    test("Compound Proposition With Bi Implication", () => {
      assertGeneratorResult("p <=> q", {
        p: ["T", "T", "F", "F"],
        q: ["T", "F", "T", "F"],
        result: ["T", "F", "F", "T"],
      });
    });

    test("Compound Proposition With Negation", () => {
      assertGeneratorResult("(!p) & (!q)", {
        p: ["T", "T", "F", "F"],
        q: ["T", "F", "T", "F"],
        result: ["F", "F", "F", "T"],
      });
    });
  });
});
