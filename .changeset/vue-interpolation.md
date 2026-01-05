---
"shopware-twig-parser": minor
---

Add support for Vue interpolation

Vue template expressions (`{{ expression }}`) are now parsed as `vue_interpolation` nodes. Supports standalone interpolation, mixed content with text, and complex expressions like ternaries and function calls.

