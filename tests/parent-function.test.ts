import { parse } from "../src/index.js";
import { expect, it } from "vitest";

it("parses parent function", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("{% parent() %}");

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "function": {
              "name": "parent",
              "type": "twig_function",
            },
            "type": "twig_statement_directive",
          },
        ],
        "type": "template",
      },
    }
  `);
});
