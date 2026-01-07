import { it, expect } from "vitest";
import { parse } from "../src/index.js";

it("parses vue interpolation inside element", () => {
  // ARRANGE
  const subject = parse;
  const input = "<h2>{{ title }}</h2>";

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
                "expression": "title",
                "loc": {
                  "end": {
                    "column": 15,
                    "line": 1,
                  },
                  "start": {
                    "column": 4,
                    "line": 1,
                  },
                },
                "type": "vue_interpolation",
              },
            ],
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
            "name": "h2",
            "type": "html_element",
          },
        ],
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
        "type": "template",
      },
    }
  `);
});

it("parses vue interpolation with mixed content", () => {
  // ARRANGE
  const subject = parse;
  const input = "<h2>Hello {{ name }} World</h2>";

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
                "content": "Hello",
                "loc": {
                  "end": {
                    "column": 9,
                    "line": 1,
                  },
                  "start": {
                    "column": 4,
                    "line": 1,
                  },
                },
                "type": "content",
              },
              {
                "expression": "name",
                "loc": {
                  "end": {
                    "column": 20,
                    "line": 1,
                  },
                  "start": {
                    "column": 10,
                    "line": 1,
                  },
                },
                "type": "vue_interpolation",
              },
              {
                "content": "World",
                "loc": {
                  "end": {
                    "column": 26,
                    "line": 1,
                  },
                  "start": {
                    "column": 21,
                    "line": 1,
                  },
                },
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 31,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "h2",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 31,
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

it("parses vue interpolation with property access", () => {
  // ARRANGE
  const subject = parse;
  const input = "<span>{{ user.profile.name }}</span>";

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
                "expression": "user.profile.name",
                "loc": {
                  "end": {
                    "column": 29,
                    "line": 1,
                  },
                  "start": {
                    "column": 6,
                    "line": 1,
                  },
                },
                "type": "vue_interpolation",
              },
            ],
            "loc": {
              "end": {
                "column": 36,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "span",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 36,
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

it("parses vue interpolation with method call", () => {
  // ARRANGE
  const subject = parse;
  const input = "<span>{{ formatDate(timestamp) }}</span>";

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
                "expression": "formatDate(timestamp)",
                "loc": {
                  "end": {
                    "column": 33,
                    "line": 1,
                  },
                  "start": {
                    "column": 6,
                    "line": 1,
                  },
                },
                "type": "vue_interpolation",
              },
            ],
            "loc": {
              "end": {
                "column": 40,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "span",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 40,
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

it("parses vue interpolation with ternary operator", () => {
  // ARRANGE
  const subject = parse;
  const input = "<span>{{ isActive ? 'Yes' : 'No' }}</span>";

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
                "expression": "isActive ? 'Yes' : 'No'",
                "loc": {
                  "end": {
                    "column": 35,
                    "line": 1,
                  },
                  "start": {
                    "column": 6,
                    "line": 1,
                  },
                },
                "type": "vue_interpolation",
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
            "name": "span",
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

it("parses vue interpolation with translation function", () => {
  // ARRANGE
  const subject = parse;
  const input = "<h2>{{ $t('sw-theme-manager.general.mainMenuItemGeneral') }}</h2>";

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
                "expression": "$t('sw-theme-manager.general.mainMenuItemGeneral')",
                "loc": {
                  "end": {
                    "column": 60,
                    "line": 1,
                  },
                  "start": {
                    "column": 4,
                    "line": 1,
                  },
                },
                "type": "vue_interpolation",
              },
            ],
            "loc": {
              "end": {
                "column": 65,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "h2",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 65,
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

it("parses multiple vue interpolations in one element", () => {
  // ARRANGE
  const subject = parse;
  const input = "<p>{{ greeting }}, {{ name }}!</p>";

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
                "expression": "greeting",
                "loc": {
                  "end": {
                    "column": 17,
                    "line": 1,
                  },
                  "start": {
                    "column": 3,
                    "line": 1,
                  },
                },
                "type": "vue_interpolation",
              },
              {
                "content": ",",
                "loc": {
                  "end": {
                    "column": 18,
                    "line": 1,
                  },
                  "start": {
                    "column": 17,
                    "line": 1,
                  },
                },
                "type": "content",
              },
              {
                "expression": "name",
                "loc": {
                  "end": {
                    "column": 29,
                    "line": 1,
                  },
                  "start": {
                    "column": 19,
                    "line": 1,
                  },
                },
                "type": "vue_interpolation",
              },
              {
                "content": "!",
                "loc": {
                  "end": {
                    "column": 30,
                    "line": 1,
                  },
                  "start": {
                    "column": 29,
                    "line": 1,
                  },
                },
                "type": "content",
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
            "name": "p",
            "type": "html_element",
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

it("parses vue interpolation at root level", () => {
  // ARRANGE
  const subject = parse;
  const input = "{{ message }}";

  // ACT
  const result = subject(input);

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "expression": "message",
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
            "type": "vue_interpolation",
          },
        ],
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
        "type": "template",
      },
    }
  `);
});

it("parses empty vue interpolation", () => {
  // ARRANGE
  const subject = parse;
  const input = "<p>{{}}</p>";

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
                "expression": "",
                "loc": {
                  "end": {
                    "column": 7,
                    "line": 1,
                  },
                  "start": {
                    "column": 3,
                    "line": 1,
                  },
                },
                "type": "vue_interpolation",
              },
            ],
            "loc": {
              "end": {
                "column": 11,
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
            "column": 11,
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

it("parses vue interpolation with object literal", () => {
  // ARRANGE
  const subject = parse;
  const input = "<span>{{ { active: isActive, disabled: !enabled } }}</span>";

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
                "expression": "{ active: isActive, disabled: !enabled }",
                "loc": {
                  "end": {
                    "column": 52,
                    "line": 1,
                  },
                  "start": {
                    "column": 6,
                    "line": 1,
                  },
                },
                "type": "vue_interpolation",
              },
            ],
            "loc": {
              "end": {
                "column": 59,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "span",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 59,
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

it("parses vue interpolation in nested elements", () => {
  // ARRANGE
  const subject = parse;
  const input = `
    <div>
      <span>{{ label }}</span>
    </div>
  `;

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
                "children": [
                  {
                    "expression": "label",
                    "loc": {
                      "end": {
                        "column": 23,
                        "line": 3,
                      },
                      "start": {
                        "column": 12,
                        "line": 3,
                      },
                    },
                    "type": "vue_interpolation",
                  },
                ],
                "loc": {
                  "end": {
                    "column": 30,
                    "line": 3,
                  },
                  "start": {
                    "column": 6,
                    "line": 3,
                  },
                },
                "name": "span",
                "type": "html_element",
              },
            ],
            "loc": {
              "end": {
                "column": 10,
                "line": 4,
              },
              "start": {
                "column": 4,
                "line": 2,
              },
            },
            "name": "div",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 2,
            "line": 5,
          },
          "start": {
            "column": 4,
            "line": 2,
          },
        },
        "type": "template",
      },
    }
  `);
});

