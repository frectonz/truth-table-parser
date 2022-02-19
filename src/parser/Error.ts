export class TTPError {
  type: ErrorType;
  msg: string;
  lineNumber: number;
  position: number;

  constructor(type: ErrorType, msg: string, line: number, pos: number) {
    this.type = type;
    this.msg = msg;
    this.position = pos;
    this.lineNumber = line;
  }
}

export enum ErrorType {
  SYNTAX,
  UNARY,
  BINARY,
  VARIABLE,
  PROPOSITION,
}
