import { it, expect } from "vitest";
import { parse } from "../../src/index.js";

it("parses script element", () => {
  const result = parse("<script>console.log('hello');</script>");

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": "console.log('hello');",
                "loc": {
                  "end": {
                    "column": 29,
                    "line": 1,
                  },
                  "start": {
                    "column": 8,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 38,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "script",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 38,
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

it("parses script element with attributes", () => {
  const result = parse('<script type="module" src="app.js"></script>');

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "attributes": [
              {
                "loc": {
                  "end": {
                    "column": 21,
                    "line": 1,
                  },
                  "start": {
                    "column": 8,
                    "line": 1,
                  },
                },
                "name": "type",
                "type": "html_attribute",
                "value": "module",
              },
              {
                "loc": {
                  "end": {
                    "column": 34,
                    "line": 1,
                  },
                  "start": {
                    "column": 22,
                    "line": 1,
                  },
                },
                "name": "src",
                "type": "html_attribute",
                "value": "app.js",
              },
            ],
            "children": [],
            "loc": {
              "end": {
                "column": 44,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "script",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 44,
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

it("parses style element", () => {
  const result = parse("<style>.foo { color: red; }</style>");

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": ".foo { color: red; }",
                "loc": {
                  "end": {
                    "column": 27,
                    "line": 1,
                  },
                  "start": {
                    "column": 7,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 35,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "style",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 35,
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

it("parses style element with attributes", () => {
  const result = parse('<style scoped lang="scss">.foo { color: red; }</style>');

  expect(result).toMatchInlineSnapshot(`
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
                    "column": 7,
                    "line": 1,
                  },
                },
                "name": "scoped",
                "type": "html_attribute",
              },
              {
                "loc": {
                  "end": {
                    "column": 25,
                    "line": 1,
                  },
                  "start": {
                    "column": 14,
                    "line": 1,
                  },
                },
                "name": "lang",
                "type": "html_attribute",
                "value": "scss",
              },
            ],
            "children": [
              {
                "content": ".foo { color: red; }",
                "loc": {
                  "end": {
                    "column": 46,
                    "line": 1,
                  },
                  "start": {
                    "column": 26,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 54,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "style",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 54,
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

it("parses empty script element", () => {
  const result = parse("<script></script>");

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [],
            "loc": {
              "end": {
                "column": 17,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "script",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 17,
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

it("parses script element alongside html elements", () => {
  const result = parse("<div>Hello</div><script>alert(1);</script>");

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": "Hello",
                "loc": {
                  "end": {
                    "column": 10,
                    "line": 1,
                  },
                  "start": {
                    "column": 5,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 16,
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
          {
            "children": [
              {
                "content": "alert(1);",
                "loc": {
                  "end": {
                    "column": 33,
                    "line": 1,
                  },
                  "start": {
                    "column": 24,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 42,
                "line": 1,
              },
              "start": {
                "column": 16,
                "line": 1,
              },
            },
            "name": "script",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 42,
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

it("parses multiline script content", () => {
  const result = parse(`<script>
function foo() {
  return 42;
}
</script>`);

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": "
    function foo() {
      return 42;
    }
    ",
                "loc": {
                  "end": {
                    "column": 0,
                    "line": 5,
                  },
                  "start": {
                    "column": 8,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 9,
                "line": 5,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "script",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 9,
            "line": 5,
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

it("parses Vue SFC style structure", () => {
  const result = parse(`<template><div>Hello</div></template>
<script>export default {}</script>
<style>.app { margin: 0; }</style>`);

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "children": [
                  {
                    "content": "Hello",
                    "loc": {
                      "end": {
                        "column": 20,
                        "line": 1,
                      },
                      "start": {
                        "column": 15,
                        "line": 1,
                      },
                    },
                    "type": "content",
                  },
                ],
                "loc": {
                  "end": {
                    "column": 26,
                    "line": 1,
                  },
                  "start": {
                    "column": 10,
                    "line": 1,
                  },
                },
                "name": "div",
                "type": "html_element",
              },
            ],
            "loc": {
              "end": {
                "column": 37,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "template",
            "type": "html_element",
          },
          {
            "children": [
              {
                "content": "export default {}",
                "loc": {
                  "end": {
                    "column": 25,
                    "line": 2,
                  },
                  "start": {
                    "column": 8,
                    "line": 2,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 34,
                "line": 2,
              },
              "start": {
                "column": 0,
                "line": 2,
              },
            },
            "name": "script",
            "type": "html_element",
          },
          {
            "children": [
              {
                "content": ".app { margin: 0; }",
                "loc": {
                  "end": {
                    "column": 26,
                    "line": 3,
                  },
                  "start": {
                    "column": 7,
                    "line": 3,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 34,
                "line": 3,
              },
              "start": {
                "column": 0,
                "line": 3,
              },
            },
            "name": "style",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 34,
            "line": 3,
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

