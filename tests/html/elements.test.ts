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
                "type": "content",
              },
            ],
            "loc": {
              "end": {
                "column": 12,
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
            "column": 12,
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
            "loc": {
              "end": {
                "column": 7,
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
            "column": 7,
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
                "type": "content",
              },
              {
                "children": [
                  {
                    "content": "World",
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
                    "column": 27,
                    "line": 1,
                  },
                  "start": {
                    "column": 9,
                    "line": 1,
                  },
                },
                "name": "span",
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
            "name": "p",
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
            "name": "br",
            "type": "html_element",
            "void": true,
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
                "loc": {
                  "end": {
                    "column": 18,
                    "line": 1,
                  },
                  "start": {
                    "column": 7,
                    "line": 1,
                  },
                },
                "name": "type",
                "type": "html_attribute",
                "value": "text",
              },
            ],
            "children": [],
            "loc": {
              "end": {
                "column": 21,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "input",
            "type": "html_element",
            "void": true,
          },
        ],
        "loc": {
          "end": {
            "column": 21,
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
                    "loc": {
                      "end": {
                        "column": 24,
                        "line": 1,
                      },
                      "start": {
                        "column": 13,
                        "line": 1,
                      },
                    },
                    "name": "type",
                    "type": "html_attribute",
                    "value": "text",
                  },
                ],
                "children": [],
                "loc": {
                  "end": {
                    "column": 27,
                    "line": 1,
                  },
                  "start": {
                    "column": 6,
                    "line": 1,
                  },
                },
                "name": "input",
                "type": "html_element",
                "void": true,
              },
              {
                "content": "This is some content",
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
            "name": "body",
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

it("parses void tags with attributes", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject("<img src='https://example.com/image.jpg'>");

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
                    "column": 40,
                    "line": 1,
                  },
                  "start": {
                    "column": 5,
                    "line": 1,
                  },
                },
                "name": "src",
                "type": "html_attribute",
                "value": "https://example.com/image.jpg",
              },
            ],
            "children": [],
            "loc": {
              "end": {
                "column": 41,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "img",
            "type": "html_element",
            "void": true,
          },
        ],
        "loc": {
          "end": {
            "column": 41,
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
                "loc": {
                  "end": {
                    "column": 13,
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
                "column": 22,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "my-tag",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 22,
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
                "loc": {
                  "end": {
                    "column": 13,
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
                "column": 22,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "my:tag",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 22,
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
