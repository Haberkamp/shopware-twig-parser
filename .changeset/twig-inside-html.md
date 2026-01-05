---
"shopware-twig-parser": minor
---

Add support for Twig blocks inside HTML elements

HTML elements containing Twig blocks now correctly preserve the parent element structure. Previously, the parent HTML element would be lost when it contained `{% block %}` directives.

