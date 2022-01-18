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
    expect(tokens.join(",")).toBe(expected);
  };

  describe("Single Token Tests", () => {
    test("negation", () => {
      assertLexResult("!", "NOT");
    });

    test("conjunction", () => {
      assertLexResult("&", "AND");
    });

    test("disjunction", () => {
      assertLexResult("|", "OR");
    });

    test("implication", () => {
      assertLexResult("=>", "IMPL");
    });

    test("bi-implication", () => {
      assertLexResult("<=>", "BI-IMPL");
    });

    test("name", () => {
      assertLexResult("p", "#p#");
    });

    test("error", () => {
      assertLexResult(".", "E1/1");
    });

    test("open brace", () => {
      assertLexResult("(", "LPAREN");
    });

    test("close brace", () => {
      assertLexResult(")", "RPAREN");
    });
  });

  describe("White Space", () => {
    test("Nothing But White Space", () => {
      assertLexResult("  ", "");
      assertLexResult("  \t \n", "");
    });
    test("White Space Before", () => {
      assertLexResult("  \t \n p", "#p#");
    });
    test("White Space Before And After", () => {
      assertLexResult("  \t p \n", "#p#");
    });
    test("White Space After", () => {
      assertLexResult("p \n", "#p#");
    });
    test("White Space between tokens", () => {
      assertLexResult("p q", "#p#,#q#");
    });
  });

  describe("Multiple Token Tests", () => {
    test("Simple Sequence", () => {
      assertLexResult("p & q", "#p#,AND,#q#");
    });
    test("Complex Sequence", () => {
      assertLexResult(
        "!(p => q) & (r => s)",
        "NOT,LPAREN,#p#,IMPL,#q#,RPAREN,AND,LPAREN,#r#,IMPL,#s#,RPAREN"
      );
    });
    test("All Tokens", () => {
      assertLexResult(
        "() ! & | => <=> p",
        "LPAREN,RPAREN,NOT,AND,OR,IMPL,BI-IMPL,#p#"
      );
    });
    test("Multiple Lines", () => {
      assertLexResult(
        "() \n !\n &\n \n|\n\n\n\n =>\n <=> \n\n\n\n\np\n",
        "LPAREN,RPAREN,NOT,AND,OR,IMPL,BI-IMPL,#p#"
      );
    });
  });
});
