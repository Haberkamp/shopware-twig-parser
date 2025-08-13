import { it, expect } from "vitest";
import { parse } from "../src/index.js";

it("parses if statements", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("{% if VUE3 %}Some Content{% endif %}");

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": "Some Content",
                "type": "content",
              },
            ],
            "condition": {
              "expression": {
                "content": "VUE3",
                "type": "twig_expression",
              },
              "type": "twig_condition",
            },
            "type": "twig_statement_directive",
          },
        ],
        "type": "template",
      },
    }
  `);
});
