import { Lexer } from "../../src/lexer/Lexer";
import { TestTokenCollector } from "./TestTokenCollector";

describe("Lexer Tests", () => {
  let tokens: string[];
  let lexer: Lexer;
  beforeEach(() => {
    tokens = [];
    lexer = new Lexer(new TestTokenCollector(tokens));
  });

  const assertLexResult = (input: string, expected: string) => {
    lexer.lex(input);
    expect(tokens.join(", ")).toBe(expected);
  };

  describe("Single Token Tests", () => {
    test("negation", () => {
      assertLexResult("!", "[NOT (1, 1)]");
    });

    test("conjunction", () => {
      assertLexResult("&", "[AND (1, 1)]");
    });

    test("disjunction", () => {
      assertLexResult("|", "[OR (1, 1)]");
    });

    test("implication", () => {
      assertLexResult("=>", "[IMPL (1, 1)]");
    });

    test("bi-implication", () => {
      assertLexResult("<=>", "[BI-IMPL (1, 1)]");
    });

    test("name", () => {
      assertLexResult("p", "[#p# (1, 1)]");
    });

    test("error", () => {
      assertLexResult(".", "E1/1");
    });

    test("open brace", () => {
      assertLexResult("(", "[LPAREN (1, 1)]");
    });

    test("close brace", () => {
      assertLexResult(")", "[RPAREN (1, 1)]");
    });
  });

  describe("White Space", () => {
    test("Nothing But White Space", () => {
      assertLexResult("  ", "");
      assertLexResult("  \t \n", "");
    });
    test("White Space Before", () => {
      assertLexResult("  \t \n p", "[#p# (1, 1)]");
    });
    test("White Space Before And After", () => {
      assertLexResult("  \t p \n", "[#p# (1, 1)]");
    });
    test("White Space After", () => {
      assertLexResult("p \n", "[#p# (1, 1)]");
    });
    test("White Space between tokens", () => {
      assertLexResult("p q", "[#p# (1, 1)], [#q# (1, 3)]");
    });
  });

  describe("Multiple Token Tests", () => {
    test("Simple Sequence", () => {
      assertLexResult("p & q", "[#p# (1, 1)], [AND (1, 3)], [#q# (1, 5)]");
    });
    test("Complex Sequence", () => {
      assertLexResult(
        "!(p => q) & (r => s)",
        "[NOT (1, 1)], [LPAREN (1, 2)], [#p# (1, 3)], [IMPL (1, 5)], [#q# (1, 8)], [RPAREN (1, 9)], [AND (1, 11)], [LPAREN (1, 13)], [#r# (1, 14)], [IMPL (1, 16)], [#s# (1, 19)], [RPAREN (1, 20)]"
      );
    });
    test("All Tokens", () => {
      assertLexResult(
        "() ! & | => <=> p",
        "[LPAREN (1, 1)], [RPAREN (1, 2)], [NOT (1, 4)], [AND (1, 6)], [OR (1, 8)], [IMPL (1, 10)], [BI-IMPL (1, 13)], [#p# (1, 17)]"
      );
    });
    test("Multiple Lines", () => {
      assertLexResult(
        "() \n !\n &\n \n|\n\n\n\n =>\n <=> \n\n\n\n\np\n",
        "[LPAREN (1, 1)], [RPAREN (1, 2)], [NOT (2, 1)], [AND (3, 1)], [OR (5, 1)], [IMPL (9, 1)], [BI-IMPL (10, 1)], [#p# (15, 1)]"
      );
    });
  });
});
