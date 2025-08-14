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
            "type": "doctype",
          },
        ],
        "type": "template",
      },
    }
  `);
});
