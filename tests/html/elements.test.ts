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

it("parses nested html elements", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("<p>Hello <span>World</span></p>");

  // ASSERT
  expect(result).toMatchInlineSnapshot(
    `
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": "Hello",
                "type": "content",
              },
              {
                "children": [
                  {
                    "content": "World",
                    "type": "content",
                  },
                ],
                "name": "span",
                "type": "html_element",
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

it("parses void tags", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("<br>");

  // ASSERT
  expect(result).toMatchInlineSnapshot(
    `
    {
      "rootNode": {
        "children": [
          {
            "children": [],
            "name": "br",
            "type": "html_element",
            "void": true,
          },
        ],
        "type": "template",
      },
    }
  `
  );
});

it("parses self closing tags", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject('<input type="text" />');

  // ASSERT
  expect(result).toMatchInlineSnapshot(
    `
    {
      "rootNode": {
        "children": [
          {
            "attributes": [
              {
                "name": "type",
                "type": "html_attribute",
                "value": "text",
              },
            ],
            "children": [],
            "name": "input",
            "type": "html_element",
            "void": true,
          },
        ],
        "type": "template",
      },
    }
  `
  );
});

it("parses self closing tags and content after them on the same level", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject(
    "<body><input type='text' /> This is some content</body>"
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
                "attributes": [
                  {
                    "name": "type",
                    "type": "html_attribute",
                    "value": "text",
                  },
                ],
                "children": [],
                "name": "input",
                "type": "html_element",
                "void": true,
              },
              {
                "content": "This is some content",
                "type": "content",
              },
            ],
            "name": "body",
            "type": "html_element",
          },
        ],
        "type": "template",
      },
    }
    `
  );
});

it("parses custom tags", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("<my-tag>Hello</my-tag>");

  // ASSERT
  expect(result).toMatchInlineSnapshot(
    `
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
            "name": "my-tag",
            "type": "html_element",
          },
        ],
        "type": "template",
      },
    }
    `
  );
});

it("parses custom tags with colons in the name", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("<my:tag>Hello</my:tag>");

  // ASSERT
  expect(result).toMatchInlineSnapshot(
    `
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
            "name": "my:tag",
            "type": "html_element",
          },
        ],
        "type": "template",
      },
    }
    `
  );
});
