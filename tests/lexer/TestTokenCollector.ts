import { TokenCollector } from "../../src/lexer/TokenCollector";

export class TestTokenCollector implements TokenCollector {
  tokens: string[];
  constructor(tokens: string[]) {
    this.tokens = tokens;
  }

  name(name: string, line: number, pos: number) {
    this.tokens.push(`#${name}#`);
  }

  biImplication() {
    this.tokens.push("BI-IMPL");
  }

  implication() {
    this.tokens.push("IMPL");
  }

  conjunction() {
    this.tokens.push("AND");
  }

  disjunction() {
    this.tokens.push("OR");
  }

  negation() {
    this.tokens.push("NOT");
  }

  error(line: number, pos: number) {
    this.tokens.push(`E${line}/${pos}`);
  }

  openParen() {
    this.tokens.push("LPAREN");
  }

  closeParen() {
    this.tokens.push("RPAREN");
  }
}
