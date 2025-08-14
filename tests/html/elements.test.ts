import { it, expect } from "vitest";
import { parse } from "../../src/index.js";

it("parses html tags", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("<p>Hello</p>");

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": "Hello",
                "type": "content",
              },
            ],
            "name": "p",
            "type": "html_element",
          },
        ],
        "type": "template",
      },
    }
  `);
});

it("parses empty html elements", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("<p></p>");

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [],
            "name": "p",
            "type": "html_element",
          },
        ],
        "type": "template",
      },
    }
  `);
});
