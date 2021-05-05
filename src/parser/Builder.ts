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
  unaryError: (
    state: ParserState,
    event: ParserEvent,
    line: number,
    pos: number
  ) => void;
  binaryError: (
    state: ParserState,
    event: ParserEvent,
    line: number,
    pos: number
  ) => void;
  variableError: (
    state: ParserState,
    event: ParserEvent,
    line: number,
    pos: number
  ) => void;
  propositionError: (
    state: ParserState,
    event: ParserEvent,
    line: number,
    pos: number
  ) => void;
}
