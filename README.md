# Truth Table Parser

## Examples

```
p
!p
p & q
!p & q
(p => q)
!(p | q)
(p <=> q)
(!p => q)
((p => q) & (r => s))
```

## Backus Naur Form (BNF)

```
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
