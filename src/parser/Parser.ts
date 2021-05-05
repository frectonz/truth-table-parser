import { Builder } from "./Builder";
import { TokenCollector } from "../lexer/TokenCollector";
import { ParserState } from "./ParserState";
import { ParserEvent } from "./ParserEvent";

const {
  END,
  VAR,
  PROP,
  UNARY_CON,
  BINARY_CON,
  PROP_LPAREN,
  PROP_RPAREN,
} = ParserState;

const { EOF, UNARY, BINARY, NAME, LPAREN, RPAREN } = ParserEvent;

class Transition {
  constructor(
    public currentState: ParserState,
    public event: ParserEvent,
    public nextState: ParserState,
    public action: ((builder: Builder) => void) | null
  ) {}
}

export class Parser implements TokenCollector {
  private state: ParserState = ParserState.PROP;
  private builder: Builder;
  private transitions: Transition[] = [
    new Transition(PROP, NAME, VAR, (b) => b.createVar()),
    new Transition(PROP, UNARY, UNARY_CON, (b) => b.addNegation()),
    new Transition(PROP, LPAREN, PROP_LPAREN, (b) => b.startProp()),

    new Transition(VAR, BINARY, BINARY_CON, null),
    new Transition(VAR, RPAREN, PROP_RPAREN, (b) => b.endProp()),
    new Transition(VAR, EOF, END, (b) => b.done()),

    new Transition(PROP_LPAREN, NAME, VAR, (b) => b.createVar()),
    new Transition(PROP_LPAREN, LPAREN, PROP_LPAREN, (b) => b.startProp()),
    new Transition(PROP_LPAREN, UNARY, UNARY_CON, (b) => b.addNegation()),

    new Transition(PROP_RPAREN, BINARY, BINARY_CON, (b) => b.startProp()),
    new Transition(PROP_RPAREN, RPAREN, PROP_RPAREN, (b) => b.endProp()),
    new Transition(PROP_RPAREN, EOF, END, (b) => b.done()),

    new Transition(BINARY_CON, NAME, VAR, (b) => b.createVar()),
    new Transition(BINARY_CON, LPAREN, PROP_LPAREN, null),

    new Transition(UNARY_CON, NAME, VAR, (b) => b.createVar()),
    new Transition(UNARY_CON, LPAREN, PROP_LPAREN, (b) => b.startProp()),
  ];

  constructor(builder: Builder) {
    this.builder = builder;
  }

  error(line: number, pos: number) {
    this.builder.syntaxError(line, pos);
  }

  name(name: string, line: number, pos: number) {
    this.builder.setVarName(name);
    this.handleEvent(ParserEvent.NAME, line, pos);
  }

  openParen(line: number, pos: number) {
    this.handleEvent(ParserEvent.LPAREN, line, pos);
  }

  closeParen(line: number, pos: number) {
    this.handleEvent(ParserEvent.RPAREN, line, pos);
  }

  negation(line: number, pos: number) {
    this.handleEvent(ParserEvent.UNARY, line, pos);
  }

  conjunction(line: number, pos: number) {
    this.builder.addConjunction();
    this.handleEvent(ParserEvent.BINARY, line, pos);
  }

  disjunction(line: number, pos: number) {
    this.builder.addDisjunction();
    this.handleEvent(ParserEvent.BINARY, line, pos);
  }

  implication(line: number, pos: number) {
    this.builder.addImplication();
    this.handleEvent(ParserEvent.BINARY, line, pos);
  }

  biImplication(line: number, pos: number) {
    this.builder.addBiImplication();
    this.handleEvent(ParserEvent.BINARY, line, pos);
  }

  done(line: number, pos: number) {
    this.handleEvent(ParserEvent.EOF, line, pos);
  }

  parse() {
    this.handleEvent(ParserEvent.EOF, -1, -1);
  }

  handleEvent(event: ParserEvent, line: number, pos: number) {
    for (const transition of this.transitions) {
      if (
        transition.currentState === this.state &&
        transition.event === event
      ) {
        this.state = transition.nextState;
        if (transition.action !== null) transition.action(this.builder);
        return;
      }
    }
    this.handleErrorEvent(event, line, pos);
  }

  handleErrorEvent(event: ParserEvent, line: number, pos: number) {
    switch (this.state) {
      case ParserState.VAR:
        this.builder.variableError(this.state, event, line, pos);
        break;
      case ParserState.PROP:
      case ParserState.PROP_LPAREN:
      case ParserState.PROP_RPAREN:
        this.builder.propositionError(this.state, event, line, pos);
        break;
      case ParserState.BINARY_CON:
        this.builder.binaryError(this.state, event, line, pos);
        break;
      case ParserState.UNARY_CON:
        this.builder.unaryError(this.state, event, line, pos);
        break;
    }
  }
}
