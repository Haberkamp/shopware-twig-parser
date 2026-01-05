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
                        "type": "content",
                      },
                    ],
                    "name": "span",
                    "type": "html_element",
                  },
                ],
                "tag": {
                  "name": "block",
                  "type": "twig_tag",
                },
                "type": "twig_statement_directive",
                "variable": {
                  "content": "inner",
                  "type": "twig_variable",
                },
              },
            ],
            "name": "div",
            "type": "html_element",
          },
        ],
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
                        "type": "content",
                      },
                    ],
                    "name": "li",
                    "type": "html_element",
                  },
                ],
                "condition": {
                  "expression": {
                    "content": "items",
                    "type": "twig_expression",
                  },
                  "type": "twig_condition",
                },
                "type": "twig_statement_directive",
              },
            ],
            "name": "ul",
            "type": "html_element",
          },
        ],
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
                "tag": {
                  "name": "block",
                  "type": "twig_tag",
                },
                "type": "twig_statement_directive",
                "variable": {
                  "content": "first",
                  "type": "twig_variable",
                },
              },
              {
                "children": [],
                "tag": {
                  "name": "block",
                  "type": "twig_tag",
                },
                "type": "twig_statement_directive",
                "variable": {
                  "content": "second",
                  "type": "twig_variable",
                },
              },
            ],
            "name": "div",
            "type": "html_element",
          },
        ],
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
                "name": "class",
                "type": "html_attribute",
                "value": "outer",
              },
            ],
            "children": [
              {
                "attributes": [
                  {
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
                            "type": "content",
                          },
                        ],
                        "name": "span",
                        "type": "html_element",
                      },
                    ],
                    "tag": {
                      "name": "block",
                      "type": "twig_tag",
                    },
                    "type": "twig_statement_directive",
                    "variable": {
                      "content": "content",
                      "type": "twig_variable",
                    },
                  },
                ],
                "name": "div",
                "type": "html_element",
              },
            ],
            "name": "div",
            "type": "html_element",
          },
        ],
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
                            "name": "#smart-bar-header",
                            "type": "html_attribute",
                          },
                        ],
                        "children": [
                          {
                            "children": [
                              {
                                "expression": "title",
                                "type": "vue_interpolation",
                              },
                            ],
                            "name": "h2",
                            "type": "html_element",
                          },
                        ],
                        "name": "template",
                        "type": "html_element",
                      },
                    ],
                    "tag": {
                      "name": "block",
                      "type": "twig_tag",
                    },
                    "type": "twig_statement_directive",
                    "variable": {
                      "content": "sw_page_toolbar",
                      "type": "twig_variable",
                    },
                  },
                ],
                "name": "sw-page",
                "type": "html_element",
              },
            ],
            "tag": {
              "name": "block",
              "type": "twig_tag",
            },
            "type": "twig_statement_directive",
            "variable": {
              "content": "sw_page",
              "type": "twig_variable",
            },
          },
        ],
        "type": "template",
      },
    }
  `);
});

