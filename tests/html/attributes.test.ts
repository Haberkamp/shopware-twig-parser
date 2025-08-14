import { it, expect } from "vitest";
import { parse } from "../../src/index.js";

it("parses attributes", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject('<p class="test">Hello</p>');

  // ASSERT
  expect(result).toMatchInlineSnapshot(
    `
    {
      "rootNode": {
        "children": [
          {
            "attributes": [
              {
                "name": "class",
                "type": "html_attribute",
                "value": "test",
              },
            ],
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
  `
  );
});

it("parses attributes without values", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("<p class>Hello</p>");

  // ASSERT
  expect(result).toMatchInlineSnapshot(
    `
    {
      "rootNode": {
        "children": [
          {
            "attributes": [
              {
                "name": "class",
                "type": "html_attribute",
              },
            ],
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
    `
  );
});

it("parses attributes without quotes", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("<p class=test>Hello</p>");

  // ASSERT
  expect(result).toMatchInlineSnapshot(
    `
    {
      "rootNode": {
        "children": [
          {
            "attributes": [
              {
                "name": "class",
                "type": "html_attribute",
                "value": "test",
              },
            ],
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
    `
  );
});
