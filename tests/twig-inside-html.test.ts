import { it, expect } from "vitest";
import { parse } from "../src/index.js";

it("parses twig block inside HTML element", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject(`
<div>
    {% block inner %}
        <span>Content</span>
    {% endblock %}
</div>
  `.trim());

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
                    "children": [
                      {
                        "content": "Content",
                        "loc": {
                          "end": {
                            "column": 21,
                            "line": 3,
                          },
                          "start": {
                            "column": 14,
                            "line": 3,
                          },
                        },
                        "type": "content",
                      },
                    ],
                    "loc": {
                      "end": {
                        "column": 28,
                        "line": 3,
                      },
                      "start": {
                        "column": 8,
                        "line": 3,
                      },
                    },
                    "name": "span",
                    "type": "html_element",
                  },
                ],
                "loc": {
                  "end": {
                    "column": 21,
                    "line": 2,
                  },
                  "start": {
                    "column": 4,
                    "line": 2,
                  },
                },
                "tag": {
                  "loc": {
                    "end": {
                      "column": 12,
                      "line": 2,
                    },
                    "start": {
                      "column": 7,
                      "line": 2,
                    },
                  },
                  "name": "block",
                  "type": "twig_tag",
                },
                "type": "twig_statement_directive",
                "variable": {
                  "content": "inner",
                  "loc": {
                    "end": {
                      "column": 18,
                      "line": 2,
                    },
                    "start": {
                      "column": 13,
                      "line": 2,
                    },
                  },
                  "type": "twig_variable",
                },
              },
            ],
            "loc": {
              "end": {
                "column": 6,
                "line": 5,
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
            "column": 6,
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

it("parses twig if statement inside HTML element", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject(`
<ul>
    {% if items %}
        <li>Item</li>
    {% endif %}
</ul>
  `.trim());

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
                    "children": [
                      {
                        "content": "Item",
                        "loc": {
                          "end": {
                            "column": 16,
                            "line": 3,
                          },
                          "start": {
                            "column": 12,
                            "line": 3,
                          },
                        },
                        "type": "content",
                      },
                    ],
                    "loc": {
                      "end": {
                        "column": 21,
                        "line": 3,
                      },
                      "start": {
                        "column": 8,
                        "line": 3,
                      },
                    },
                    "name": "li",
                    "type": "html_element",
                  },
                ],
                "condition": {
                  "expression": {
                    "content": "items",
                    "loc": {
                      "end": {
                        "column": 15,
                        "line": 2,
                      },
                      "start": {
                        "column": 10,
                        "line": 2,
                      },
                    },
                    "type": "twig_expression",
                  },
                  "loc": {
                    "end": {
                      "column": 18,
                      "line": 2,
                    },
                    "start": {
                      "column": 4,
                      "line": 2,
                    },
                  },
                  "type": "twig_condition",
                },
                "loc": {
                  "end": {
                    "column": 18,
                    "line": 2,
                  },
                  "start": {
                    "column": 4,
                    "line": 2,
                  },
                },
                "type": "twig_statement_directive",
              },
            ],
            "loc": {
              "end": {
                "column": 5,
                "line": 5,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "name": "ul",
            "type": "html_element",
          },
        ],
        "loc": {
          "end": {
            "column": 5,
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

it("parses multiple twig blocks inside HTML element", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject(`
<div>
    {% block first %}{% endblock %}
    {% block second %}{% endblock %}
</div>
  `.trim());

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
                    "column": 21,
                    "line": 2,
                  },
                  "start": {
                    "column": 4,
                    "line": 2,
                  },
                },
                "tag": {
                  "loc": {
                    "end": {
                      "column": 12,
                      "line": 2,
                    },
                    "start": {
                      "column": 7,
                      "line": 2,
                    },
                  },
                  "name": "block",
                  "type": "twig_tag",
                },
                "type": "twig_statement_directive",
                "variable": {
                  "content": "first",
                  "loc": {
                    "end": {
                      "column": 18,
                      "line": 2,
                    },
                    "start": {
                      "column": 13,
                      "line": 2,
                    },
                  },
                  "type": "twig_variable",
                },
              },
              {
                "children": [],
                "loc": {
                  "end": {
                    "column": 22,
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
                  "content": "second",
                  "loc": {
                    "end": {
                      "column": 19,
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
                "column": 6,
                "line": 4,
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
            "column": 6,
            "line": 4,
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

it("parses nested HTML with twig block deeply nested", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject(`
<div class="outer">
    <div class="inner">
        {% block content %}
            <span>Hello</span>
        {% endblock %}
    </div>
</div>
  `.trim());

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
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
                    "column": 5,
                    "line": 1,
                  },
                },
                "name": "class",
                "type": "html_attribute",
                "value": "outer",
              },
            ],
            "children": [
              {
                "attributes": [
                  {
                    "loc": {
                      "end": {
                        "column": 22,
                        "line": 2,
                      },
                      "start": {
                        "column": 9,
                        "line": 2,
                      },
                    },
                    "name": "class",
                    "type": "html_attribute",
                    "value": "inner",
                  },
                ],
                "children": [
                  {
                    "children": [
                      {
                        "children": [
                          {
                            "content": "Hello",
                            "loc": {
                              "end": {
                                "column": 23,
                                "line": 4,
                              },
                              "start": {
                                "column": 18,
                                "line": 4,
                              },
                            },
                            "type": "content",
                          },
                        ],
                        "loc": {
                          "end": {
                            "column": 30,
                            "line": 4,
                          },
                          "start": {
                            "column": 12,
                            "line": 4,
                          },
                        },
                        "name": "span",
                        "type": "html_element",
                      },
                    ],
                    "loc": {
                      "end": {
                        "column": 27,
                        "line": 3,
                      },
                      "start": {
                        "column": 8,
                        "line": 3,
                      },
                    },
                    "tag": {
                      "loc": {
                        "end": {
                          "column": 16,
                          "line": 3,
                        },
                        "start": {
                          "column": 11,
                          "line": 3,
                        },
                      },
                      "name": "block",
                      "type": "twig_tag",
                    },
                    "type": "twig_statement_directive",
                    "variable": {
                      "content": "content",
                      "loc": {
                        "end": {
                          "column": 24,
                          "line": 3,
                        },
                        "start": {
                          "column": 17,
                          "line": 3,
                        },
                      },
                      "type": "twig_variable",
                    },
                  },
                ],
                "loc": {
                  "end": {
                    "column": 10,
                    "line": 6,
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
                "column": 6,
                "line": 7,
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
            "column": 6,
            "line": 7,
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

it("parses Shopware page template pattern", () => {
  // ARRANGE
  const subject = parse;

  // ACT
  const result = subject(`
{% block sw_page %}
    <sw-page class="sw-page">
        {% block sw_page_toolbar %}
            <template #smart-bar-header>
                <h2>{{ title }}</h2>
            </template>
        {% endblock %}
    </sw-page>
{% endblock %}
  `.trim());

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
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
                        "column": 28,
                        "line": 2,
                      },
                      "start": {
                        "column": 13,
                        "line": 2,
                      },
                    },
                    "name": "class",
                    "type": "html_attribute",
                    "value": "sw-page",
                  },
                ],
                "children": [
                  {
                    "children": [
                      {
                        "attributes": [
                          {
                            "loc": {
                              "end": {
                                "column": 39,
                                "line": 4,
                              },
                              "start": {
                                "column": 22,
                                "line": 4,
                              },
                            },
                            "name": "#smart-bar-header",
                            "type": "html_attribute",
                          },
                        ],
                        "children": [
                          {
                            "children": [
                              {
                                "expression": "title",
                                "loc": {
                                  "end": {
                                    "column": 31,
                                    "line": 5,
                                  },
                                  "start": {
                                    "column": 20,
                                    "line": 5,
                                  },
                                },
                                "type": "vue_interpolation",
                              },
                            ],
                            "loc": {
                              "end": {
                                "column": 36,
                                "line": 5,
                              },
                              "start": {
                                "column": 16,
                                "line": 5,
                              },
                            },
                            "name": "h2",
                            "type": "html_element",
                          },
                        ],
                        "loc": {
                          "end": {
                            "column": 23,
                            "line": 6,
                          },
                          "start": {
                            "column": 12,
                            "line": 4,
                          },
                        },
                        "name": "template",
                        "type": "html_element",
                      },
                    ],
                    "loc": {
                      "end": {
                        "column": 35,
                        "line": 3,
                      },
                      "start": {
                        "column": 8,
                        "line": 3,
                      },
                    },
                    "tag": {
                      "loc": {
                        "end": {
                          "column": 16,
                          "line": 3,
                        },
                        "start": {
                          "column": 11,
                          "line": 3,
                        },
                      },
                      "name": "block",
                      "type": "twig_tag",
                    },
                    "type": "twig_statement_directive",
                    "variable": {
                      "content": "sw_page_toolbar",
                      "loc": {
                        "end": {
                          "column": 32,
                          "line": 3,
                        },
                        "start": {
                          "column": 17,
                          "line": 3,
                        },
                      },
                      "type": "twig_variable",
                    },
                  },
                ],
                "loc": {
                  "end": {
                    "column": 14,
                    "line": 8,
                  },
                  "start": {
                    "column": 4,
                    "line": 2,
                  },
                },
                "name": "sw-page",
                "type": "html_element",
              },
            ],
            "loc": {
              "end": {
                "column": 19,
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
              "content": "sw_page",
              "loc": {
                "end": {
                  "column": 16,
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
            "column": 14,
            "line": 9,
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

