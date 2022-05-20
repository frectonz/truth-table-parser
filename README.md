# Truth Table Parser

A REPL tool and library for generating truth tables from a logical proposition (see examples).

## Demo

[![asciicast](https://asciinema.org/a/496113.svg)](https://asciinema.org/a/496113)

## Install

As a command line tool

```bash
npm install -g truth-table-parser
truth-table-parse # drops you into a REPL where you can run your propositions.
```

As a library

```bash
npm install truth-table-parser
```

## Examples

```text
> p
> !p
> p & q
> (!p) & q
> (p => q)
> !(p | q)
> (p <=> q)
> !(p => q)
> ((p => q) & (r => s))
```

## Backus-Naur Form (BNF)

The backus naur form for the syntax of a proposition.

```text
<TTP> ::= <PROPOSITION>*

<PROPOSITION> ::= <name> |
                  <UNARY-PROPOSITION> |
                  <BINARY-PROPOSITION>

<UNARY-PROPOSITION> ::= <UNARY-CONNECTIVE> <name> |
                        <UNARY-CONNECTIVE> <BINARY-PROPOSITION>

<BINARY-PROPOSITION> ::= "(" <PROPOSITION> <BINARY-CONNECTIVE> <PROPOSITION> ")"

<UNARY-CONNECTIVE> = "!"
<BINARY-CONNECTIVE> = "&" | "|" | "=>" | "<=>"
```
