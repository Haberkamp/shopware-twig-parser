import { it, expect } from "vitest";
import { parse } from "../src/index.js";

it("parses an empty twig block", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("{% block my_block %}{% endblock %}");

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [],
            "loc": {
              "end": {
                "column": 20,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "tag": {
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
              "name": "block",
              "type": "twig_tag",
            },
            "type": "twig_statement_directive",
            "variable": {
              "content": "my_block",
              "loc": {
                "end": {
                  "column": 17,
                  "line": 1,
                },
                "start": {
                  "column": 9,
                  "line": 1,
                },
              },
              "type": "twig_variable",
            },
          },
        ],
        "loc": {
          "end": {
            "column": 34,
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

it("parses nested twig blocks", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject(`
{% block my_block %}
    {% block my_nested_block %}
  {% endblock %}
{% endblock %}
`);

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "children": [],
                "loc": {
                  "end": {
                    "column": 31,
                    "line": 3,
                  },
                  "start": {
                    "column": 4,
                    "line": 3,
                  },
                },
                "tag": {
                  "loc": {
                    "end": {
                      "column": 12,
                      "line": 3,
                    },
                    "start": {
                      "column": 7,
                      "line": 3,
                    },
                  },
                  "name": "block",
                  "type": "twig_tag",
                },
                "type": "twig_statement_directive",
                "variable": {
                  "content": "my_nested_block",
                  "loc": {
                    "end": {
                      "column": 28,
                      "line": 3,
                    },
                    "start": {
                      "column": 13,
                      "line": 3,
                    },
                  },
                  "type": "twig_variable",
                },
              },
            ],
            "loc": {
              "end": {
                "column": 20,
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
              "content": "my_block",
              "loc": {
                "end": {
                  "column": 17,
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
            "column": 0,
            "line": 6,
          },
          "start": {
            "column": 0,
            "line": 2,
          },
        },
        "type": "template",
      },
    }
  `);
});
