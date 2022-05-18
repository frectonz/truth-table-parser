import { TokenCollector } from "../../src/lexer/TokenCollector";

export class TestTokenCollector implements TokenCollector {
  tokens: string[];
  constructor(tokens: string[]) {
    this.tokens = tokens;
  }

  name(name: string, line: number, pos: number) {
    this.tokens.push(`[#${name}# (${line}, ${pos})]`);
  }

  biImplication(line: number, pos: number) {
    this.tokens.push(`[BI-IMPL (${line}, ${pos})]`);
  }

  implication(line: number, pos: number) {
    this.tokens.push(`[IMPL (${line}, ${pos})]`);
  }

  conjunction(line: number, pos: number) {
    this.tokens.push(`[AND (${line}, ${pos})]`);
  }

  disjunction(line: number, pos: number) {
    this.tokens.push(`[OR (${line}, ${pos})]`);
  }

  negation(line: number, pos: number) {
    this.tokens.push(`[NOT (${line}, ${pos})]`);
  }

  error(line: number, pos: number) {
    this.tokens.push(`E${line}/${pos}`);
  }

  openParen(line: number, pos: number) {
    this.tokens.push(`[LPAREN (${line}, ${pos})]`);
  }

  closeParen(line: number, pos: number) {
    this.tokens.push(`[RPAREN (${line}, ${pos})]`);
  }

  done(line: number, pos: number) {}
}
