import { ParserState } from "./ParserState";
import { ParserEvent } from "./ParserEvent";

export interface Builder {
  createVar: () => void;
  addNegation: () => void;
  addConjunction: () => void;
  addDisjunction: () => void;
  addImplication: () => void;
  addBiImplication: () => void;
  startProp: () => void;
  endProp: () => void;
  done: () => void;

  setVarName: (name: string) => void;
  syntaxError: (line: number, pos: number) => void;
  unaryError: (line: number, pos: number) => void;
  binaryError: (line: number, pos: number) => void;
  variableError: (line: number, pos: number) => void;
  propositionError: (line: number, pos: number) => void;
}
