# shopware-twig-parser

A parser for the Shopware 6 Twig admin markup language.

## Installation

```sh
npm install shopware-twig-parser
```

## Usage

```ts
import { parse } from "shopware-twig-parser";

const tree = parse("{% block my_block %}Hello, world!{% endblock %}");
```

### Author

Hey, I'm Nils. In my spare time [I write about things](https://www.haberkamp.dev/) I learned or I create open source packages, that help me (and hopefully you) to build better apps.

## Feedback and Contributing

I highly appreceate your feedback! Please create an [issue](https://github.com/Haberkamp/shopware-twig-parser/issues/new), if you've found any bugs or want to request a feature.
