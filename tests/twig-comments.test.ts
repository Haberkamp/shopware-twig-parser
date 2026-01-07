import { it, expect } from "vitest";
import { parse } from "../src/index.js";

it("parses a simple twig comment", () => {
  // ARRANGE
  const subject = parse;
  const input = "{# This is a comment #}";

  // ACT
  const result = subject(input);

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "content": "This is a comment",
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
            "type": "twig_comment",
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
  `);
});

it("parses a multiline twig comment", () => {
  // ARRANGE
  const subject = parse;
  const input = `{# This is a
   multiline comment #}`;

  // ACT
  const result = subject(input);

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "content": "This is a
       multiline comment",
            "loc": {
              "end": {
                "column": 23,
                "line": 2,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "type": "twig_comment",
          },
        ],
        "loc": {
          "end": {
            "column": 23,
            "line": 2,
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

it("parses deprecated annotation in twig comment", () => {
  // ARRANGE
  const subject = parse;
  const input = "{# @deprecated tag:v6.8.0 - Use `mt-button` instead. #}";

  // ACT
  const result = subject(input);

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "content": "@deprecated tag:v6.8.0 - Use \`mt-button\` instead.",
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
            "type": "twig_comment",
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
  `);
});

it("parses twig comment inside HTML element", () => {
  // ARRANGE
  const subject = parse;
  const input = "<div>{# comment #}</div>";

  // ACT
  const result = subject(input);

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": "comment",
                "loc": {
                  "end": {
                    "column": 18,
                    "line": 1,
                  },
                  "start": {
                    "column": 5,
                    "line": 1,
                  },
                },
                "type": "twig_comment",
              },
            ],
            "loc": {
              "end": {
                "column": 24,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "div",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 24,
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

it("parses twig comment inline with text", () => {
  // ARRANGE
  const subject = parse;
  const input = "<p>You can also comment out {# part of a line #}.</p>";

  // ACT
  const result = subject(input);

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": "You can also comment out",
                "loc": {
                  "end": {
                    "column": 27,
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
                "content": "part of a line",
                "loc": {
                  "end": {
                    "column": 48,
                    "line": 1,
                  },
                  "start": {
                    "column": 28,
                    "line": 1,
                  },
                },
                "type": "twig_comment",
              },
              {
                "content": ".",
                "loc": {
                  "end": {
                    "column": 49,
                    "line": 1,
                  },
                  "start": {
                    "column": 48,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 53,
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
            "column": 53,
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

it("parses twig comment before twig block", () => {
  // ARRANGE
  const subject = parse;
  const input = `{# Comment #}
{% block foo %}{% endblock %}`;

  // ACT
  const result = subject(input);

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "content": "Comment",
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
            "type": "twig_comment",
          },
          {
            "children": [],
            "loc": {
              "end": {
                "column": 15,
                "line": 2,
              },
              "start": {
                "column": 0,
                "line": 2,
              },
            },
            "tag": {
              "loc": {
                "end": {
                  "column": 8,
                  "line": 2,
                },
                "start": {
                  "column": 3,
                  "line": 2,
                },
              },
              "name": "block",
              "type": "twig_tag",
            },
            "type": "twig_statement_directive",
            "variable": {
              "content": "foo",
              "loc": {
                "end": {
                  "column": 12,
                  "line": 2,
                },
                "start": {
                  "column": 9,
                  "line": 2,
                },
              },
              "type": "twig_variable",
            },
          },
        ],
        "loc": {
          "end": {
            "column": 29,
            "line": 2,
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

it("parses empty twig comment", () => {
  // ARRANGE
  const subject = parse;
  const input = "{##}";

  // ACT
  const result = subject(input);

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "content": "",
            "loc": {
              "end": {
                "column": 4,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "type": "twig_comment",
          },
        ],
        "loc": {
          "end": {
            "column": 4,
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

