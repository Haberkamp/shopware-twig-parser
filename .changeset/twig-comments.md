---
"shopware-twig-parser": minor
---

Add support for Twig comments

Twig comments (`{# ... #}`) are now parsed as `twig_comment` nodes with the comment content extracted. Comments are preserved at root level, inside HTML elements, and inside Twig blocks.

