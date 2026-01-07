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
                "loc": {
                  "end": {
                    "column": 25,
                    "line": 1,
                  },
                  "start": {
                    "column": 13,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "condition": {
              "expression": {
                "content": "VUE3",
                "loc": {
                  "end": {
                    "column": 10,
                    "line": 1,
                  },
                  "start": {
                    "column": 6,
                    "line": 1,
                  },
                },
                "type": "twig_expression",
              },
              "loc": {
                "end": {
                  "column": 13,
                  "line": 1,
                },
                "start": {
                  "column": 0,
                  "line": 1,
                },
              },
              "type": "twig_condition",
            },
            "loc": {
              "end": {
                "column": 13,
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
            "column": 36,
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
