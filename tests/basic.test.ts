import { it, expect } from "vitest";
import { parse } from "../src";

it("parses an empty twig block", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("{% block my_block %}{% endblock %}");

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "tag": {
              "name": "block",
              "type": "twig_tag",
            },
            "type": "twig_statement_directive",
            "variable": {
              "content": "my_block",
              "type": "twig_variable",
            },
          },
        ],
        "type": "template",
      },
    }
  `);
});
