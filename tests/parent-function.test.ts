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
              "loc": {
                "end": {
                  "column": 9,
                  "line": 1,
                },
                "start": {
                  "column": 3,
                  "line": 1,
                },
              },
              "name": "parent",
              "type": "twig_function",
            },
            "loc": {
              "end": {
                "column": 14,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "type": "twig_statement_directive",
          },
        ],
        "loc": {
          "end": {
            "column": 14,
            "line": 1,
          },
          "start": {
            "column": 0,
            "line": 1,
          },
        },
        "type": "template",
      },
    }
  `);
});
