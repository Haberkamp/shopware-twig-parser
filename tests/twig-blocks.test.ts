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
            "tag": {
              "name": "block",
              "type": "twig_tag",
            },
            "type": "twig_statement_directive",
            "variable": {
              "content": "my_block",
              "type": "twig_variable",
            },
          },
        ],
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
                "tag": {
                  "name": "block",
                  "type": "twig_tag",
                },
                "type": "twig_statement_directive",
                "variable": {
                  "content": "my_nested_block",
                  "type": "twig_variable",
                },
              },
            ],
            "tag": {
              "name": "block",
              "type": "twig_tag",
            },
            "type": "twig_statement_directive",
            "variable": {
              "content": "my_block",
              "type": "twig_variable",
            },
          },
        ],
        "type": "template",
      },
    }
  `);
});
