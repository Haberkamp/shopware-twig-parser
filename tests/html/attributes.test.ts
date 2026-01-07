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
                "loc": {
                  "end": {
                    "column": 15,
                    "line": 1,
                  },
                  "start": {
                    "column": 3,
                    "line": 1,
                  },
                },
                "name": "class",
                "type": "html_attribute",
                "value": "test",
              },
            ],
            "children": [
              {
                "content": "Hello",
                "loc": {
                  "end": {
                    "column": 21,
                    "line": 1,
                  },
                  "start": {
                    "column": 16,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 25,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "p",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 25,
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
                "loc": {
                  "end": {
                    "column": 8,
                    "line": 1,
                  },
                  "start": {
                    "column": 3,
                    "line": 1,
                  },
                },
                "name": "class",
                "type": "html_attribute",
              },
            ],
            "children": [
              {
                "content": "Hello",
                "loc": {
                  "end": {
                    "column": 14,
                    "line": 1,
                  },
                  "start": {
                    "column": 9,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 18,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "p",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 18,
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
                "loc": {
                  "end": {
                    "column": 13,
                    "line": 1,
                  },
                  "start": {
                    "column": 3,
                    "line": 1,
                  },
                },
                "name": "class",
                "type": "html_attribute",
                "value": "test",
              },
            ],
            "children": [
              {
                "content": "Hello",
                "loc": {
                  "end": {
                    "column": 19,
                    "line": 1,
                  },
                  "start": {
                    "column": 14,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 23,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "p",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 23,
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
  `
  );
});
