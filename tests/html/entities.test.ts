import { it, expect } from "vitest";
import { parse } from "../../src/index.js";

it("parses named entities", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("<p>Lorem ipsum &nbsp; dolor sit &copy; amet.</p>");

  // ASSERT
  expect(result).toMatchInlineSnapshot(
    `
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": "Lorem ipsum",
                "type": "content",
              },
              {
                "content": "&nbsp;",
                "type": "html_named_entity",
              },
              {
                "content": "dolor sit",
                "type": "content",
              },
              {
                "content": "&copy;",
                "type": "html_named_entity",
              },
              {
                "content": "amet.",
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

it("parses numeric entities", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("<p>Lorem ipsum &#160; dolor sit &#8212; amet.</p>");

  // ASSERT
  expect(result).toMatchInlineSnapshot(
    `
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": "Lorem ipsum",
                "type": "content",
              },
              {
                "content": "&#160;",
                "type": "html_numeric_entity",
              },
              {
                "content": "dolor sit",
                "type": "content",
              },
              {
                "content": "&#8212;",
                "type": "html_numeric_entity",
              },
              {
                "content": "amet.",
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

it("parses multiple entities", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject(
    "<p>Lorem ipsum &#xA0; dolor &#xa0; sit &nbsp; amet.</p>"
  );

  // ASSERT
  expect(result).toMatchInlineSnapshot(
    `
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": "Lorem ipsum",
                "type": "content",
              },
              {
                "content": "&#xA0;",
                "type": "html_numeric_entity",
              },
              {
                "content": "dolor",
                "type": "content",
              },
              {
                "content": "&#xa0;",
                "type": "html_numeric_entity",
              },
              {
                "content": "sit",
                "type": "content",
              },
              {
                "content": "&nbsp;",
                "type": "html_named_entity",
              },
              {
                "content": "amet.",
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
