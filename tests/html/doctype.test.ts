import { it, expect } from "vitest";
import { parse } from "../../src/index.js";

it("parses doctype", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("<!DOCTYPE html>");

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "loc": {
              "end": {
                "column": 15,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "type": "doctype",
          },
        ],
        "loc": {
          "end": {
            "column": 15,
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
