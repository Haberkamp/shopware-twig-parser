---
"shopware-twig-parser": minor
---

Add `loc` property to all AST nodes with position information (line and column). Uses ESTree-style format: `loc: { start: { line, column }, end: { line, column } }` where line is 1-based and column is 0-based.

