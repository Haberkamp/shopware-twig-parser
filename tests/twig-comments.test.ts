import { it, expect } from "vitest";
import { parse } from "../src/index.js";

it("parses a simple twig comment", () => {
  const result = parse("{# This is a comment #}");

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "content": "This is a comment",
            "type": "twig_comment",
          },
        ],
        "type": "template",
      },
    }
  `);
});

it("parses a multiline twig comment", () => {
  const result = parse(`{# This is a
   multiline comment #}`);

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "content": "This is a
       multiline comment",
            "type": "twig_comment",
          },
        ],
        "type": "template",
      },
    }
  `);
});

it("parses deprecated annotation in twig comment", () => {
  const result = parse("{# @deprecated tag:v6.8.0 - Use `mt-button` instead. #}");

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "content": "@deprecated tag:v6.8.0 - Use \`mt-button\` instead.",
            "type": "twig_comment",
          },
        ],
        "type": "template",
      },
    }
  `);
});

it("parses twig comment inside HTML element", () => {
  const result = parse("<div>{# comment #}</div>");

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": "comment",
                "type": "twig_comment",
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

it("parses twig comment inline with text", () => {
  const result = parse("<p>You can also comment out {# part of a line #}.</p>");

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "children": [
              {
                "content": "You can also comment out",
                "type": "content",
              },
              {
                "content": "part of a line",
                "type": "twig_comment",
              },
              {
                "content": ".",
                "type": "content",
              },
            ],
            "name": "p",
            "type": "html_element",
          },
        ],
        "type": "template",
      },
    }
  `);
});

it("parses twig comment before twig block", () => {
  const result = parse(`{# Comment #}
{% block foo %}{% endblock %}`);

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "content": "Comment",
            "type": "twig_comment",
          },
          {
            "children": [],
            "tag": {
              "name": "block",
              "type": "twig_tag",
            },
            "type": "twig_statement_directive",
            "variable": {
              "content": "foo",
              "type": "twig_variable",
            },
          },
        ],
        "type": "template",
      },
    }
  `);
});

it("parses empty twig comment", () => {
  const result = parse("{##}");

  expect(result).toMatchInlineSnapshot(`
    {
      "rootNode": {
        "children": [
          {
            "content": "",
            "type": "twig_comment",
          },
        ],
        "type": "template",
      },
    }
  `);
});

