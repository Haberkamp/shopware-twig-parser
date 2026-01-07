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
                "loc": {
                  "end": {
                    "column": 14,
                    "line": 1,
                  },
                  "start": {
                    "column": 3,
                    "line": 1,
                  },
                },
                "type": "content",
              },
              {
                "content": "&nbsp;",
                "loc": {
                  "end": {
                    "column": 21,
                    "line": 1,
                  },
                  "start": {
                    "column": 15,
                    "line": 1,
                  },
                },
                "type": "html_named_entity",
              },
              {
                "content": "dolor sit",
                "loc": {
                  "end": {
                    "column": 31,
                    "line": 1,
                  },
                  "start": {
                    "column": 22,
                    "line": 1,
                  },
                },
                "type": "content",
              },
              {
                "content": "&copy;",
                "loc": {
                  "end": {
                    "column": 38,
                    "line": 1,
                  },
                  "start": {
                    "column": 32,
                    "line": 1,
                  },
                },
                "type": "html_named_entity",
              },
              {
                "content": "amet.",
                "loc": {
                  "end": {
                    "column": 44,
                    "line": 1,
                  },
                  "start": {
                    "column": 39,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 48,
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
            "column": 48,
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
                "loc": {
                  "end": {
                    "column": 14,
                    "line": 1,
                  },
                  "start": {
                    "column": 3,
                    "line": 1,
                  },
                },
                "type": "content",
              },
              {
                "content": "&#160;",
                "loc": {
                  "end": {
                    "column": 21,
                    "line": 1,
                  },
                  "start": {
                    "column": 15,
                    "line": 1,
                  },
                },
                "type": "html_numeric_entity",
              },
              {
                "content": "dolor sit",
                "loc": {
                  "end": {
                    "column": 31,
                    "line": 1,
                  },
                  "start": {
                    "column": 22,
                    "line": 1,
                  },
                },
                "type": "content",
              },
              {
                "content": "&#8212;",
                "loc": {
                  "end": {
                    "column": 39,
                    "line": 1,
                  },
                  "start": {
                    "column": 32,
                    "line": 1,
                  },
                },
                "type": "html_numeric_entity",
              },
              {
                "content": "amet.",
                "loc": {
                  "end": {
                    "column": 45,
                    "line": 1,
                  },
                  "start": {
                    "column": 40,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 49,
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
            "column": 49,
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
                "loc": {
                  "end": {
                    "column": 14,
                    "line": 1,
                  },
                  "start": {
                    "column": 3,
                    "line": 1,
                  },
                },
                "type": "content",
              },
              {
                "content": "&#xA0;",
                "loc": {
                  "end": {
                    "column": 21,
                    "line": 1,
                  },
                  "start": {
                    "column": 15,
                    "line": 1,
                  },
                },
                "type": "html_numeric_entity",
              },
              {
                "content": "dolor",
                "loc": {
                  "end": {
                    "column": 27,
                    "line": 1,
                  },
                  "start": {
                    "column": 22,
                    "line": 1,
                  },
                },
                "type": "content",
              },
              {
                "content": "&#xa0;",
                "loc": {
                  "end": {
                    "column": 34,
                    "line": 1,
                  },
                  "start": {
                    "column": 28,
                    "line": 1,
                  },
                },
                "type": "html_numeric_entity",
              },
              {
                "content": "sit",
                "loc": {
                  "end": {
                    "column": 38,
                    "line": 1,
                  },
                  "start": {
                    "column": 35,
                    "line": 1,
                  },
                },
                "type": "content",
              },
              {
                "content": "&nbsp;",
                "loc": {
                  "end": {
                    "column": 45,
                    "line": 1,
                  },
                  "start": {
                    "column": 39,
                    "line": 1,
                  },
                },
                "type": "html_named_entity",
              },
              {
                "content": "amet.",
                "loc": {
                  "end": {
                    "column": 51,
                    "line": 1,
                  },
                  "start": {
                    "column": 46,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 55,
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
            "column": 55,
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
