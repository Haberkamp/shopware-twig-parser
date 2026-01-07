# shopware-twig-parser

## 0.5.0

### Minor Changes

- ca2f9ef: Add `loc` property to all AST nodes with position information (line and column). Uses ESTree-style format: `loc: { start: { line, column }, end: { line, column } }` where line is 1-based and column is 0-based.

## 0.4.0

### Minor Changes

- 7319c7c: Add support for Twig comments

  Twig comments (`{# ... #}`) are now parsed as `twig_comment` nodes with the comment content extracted. Comments are preserved at root level, inside HTML elements, and inside Twig blocks.

- 6b6d90d: Add support for Twig blocks inside HTML elements

  HTML elements containing Twig blocks now correctly preserve the parent element structure. Previously, the parent HTML element would be lost when it contained `{% block %}` directives.

- c77bb7d: Add support for Vue interpolation

  Vue template expressions (`{{ expression }}`) are now parsed as `vue_interpolation` nodes. Supports standalone interpolation, mixed content with text, and complex expressions like ternaries and function calls.

### Patch Changes

- 05fc1cd: Upgrade tree-sitter-shopware-twig to v1.1.0

  Updates the underlying grammar to support vue_interpolation and twig_comment node types.

## 0.3.2

### Patch Changes

- cecf152: parse attributes of void tags

## 0.3.1

### Patch Changes

- 454cbc7: parse self closing tags and content after on the same level

## 0.3.0

### Minor Changes

- 193b1c8: parse html entities
- e7c453e: parse html attributes
- 53ddf3b: parse self-closing and void tags
- d46a601: parse doctype
- 26877a9: parse basic html elements

## 0.2.0

### Minor Changes

- 0b16188: parse parent function calls
- a1881ab: parse if statements

## 0.1.0

### Minor Changes

- d012aa5: parse twig blocks
