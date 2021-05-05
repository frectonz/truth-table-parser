export interface TokenCollector {
  negation: (line: number, pos: number) => void;

  conjunction: (line: number, pos: number) => void;
  disjunction: (line: number, pos: number) => void;
  implication: (line: number, pos: number) => void;
  biImplication: (line: number, pos: number) => void;

  name: (name: string, line: number, pos: number) => void;
  error: (line: number, pos: number) => void;

  openParen: (line: number, pos: number) => void;
  closeParen: (line: number, pos: number) => void;
}
