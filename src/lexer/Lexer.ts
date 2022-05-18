import { TokenCollector } from "./TokenCollector";

export class Lexer {
  private collector: TokenCollector;
  private pos: number;
  private lineNumber: number;

  constructor(collector: TokenCollector) {
    this.collector = collector;
    this.pos = 0;
    this.lineNumber = 0;
  }

  lex(text: string) {
    this.lineNumber = 1;
    const lines = text.trim().split("\n");
    for (const line of lines) {
      this.lexLine(line.trim());
      this.lineNumber++;
    }
    this.collector.done(this.lineNumber - 1, this.pos);
  }

  private lexLine(line: string) {
    for (this.pos = 0; this.pos < line.length; ) {
      this.lexToken(line);
    }
  }

  private lexToken(line: string) {
    if (!this.findToken(line)) {
      this.collector.error(this.lineNumber, this.pos + 1);
      this.pos++;
    }
  }

  private findToken(line: string) {
    return (
      this.findWhiteSpace(line) ||
      this.findSingleCharacterToken(line) ||
      this.findMultiCharacterToken(line) ||
      this.findName(line)
    );
  }

  private whiteSpacePattern = /^\s+/;

  private findWhiteSpace(line: string): boolean {
    const matches = this.whiteSpacePattern.exec(line.substring(this.pos));
    if (matches && matches.length > 0) {
      this.pos += matches[0].length;
      return true;
    }
    return false;
  }

  private findSingleCharacterToken(line: string): boolean {
    const c = line.substring(this.pos, this.pos + 1);

    switch (c) {
      case "!":
        this.collector.negation(this.lineNumber, this.pos + 1);
        break;
      case "&":
        this.collector.conjunction(this.lineNumber, this.pos + 1);
        break;
      case "|":
        this.collector.disjunction(this.lineNumber, this.pos + 1);
        break;
      case "(":
        this.collector.openParen(this.lineNumber, this.pos + 1);
        break;
      case ")":
        this.collector.closeParen(this.lineNumber, this.pos + 1);
        break;
      default:
        return false;
    }

    this.pos++;
    return true;
  }

  private implicationPattern = /^=>/;
  private biImplicationPattern = /^<=>/;

  private findMultiCharacterToken(line: string): boolean {
    const implicationMatches = this.implicationPattern.exec(
      line.substring(this.pos)
    );
    if (implicationMatches && implicationMatches.length > 0) {
      this.collector.implication(this.lineNumber, this.pos + 1);
      this.pos += implicationMatches[0].length;
      return true;
    }

    const biImplicationMatches = this.biImplicationPattern.exec(
      line.substring(this.pos)
    );
    if (biImplicationMatches && biImplicationMatches.length > 0) {
      this.collector.biImplication(this.lineNumber, this.pos + 1);
      this.pos += biImplicationMatches[0].length;
      return true;
    }
    return false;
  }

  private namePattern = /^[a-z]+/;

  private findName(line: string): boolean {
    const matches = this.namePattern.exec(line.substring(this.pos));
    if (matches && matches.length > 0) {
      this.collector.name(matches[0], this.lineNumber, this.pos + 1);
      this.pos += matches[0].length;
      return true;
    }
    return false;
  }
}
