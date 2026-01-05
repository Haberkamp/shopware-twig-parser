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
            "type": "twig_comment",
          },
        ],
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
            "type": "twig_comment",
          },
        ],
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
            "type": "twig_comment",
          },
        ],
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
            "type": "twig_comment",
          },
        ],
        "type": "template",
      },
    }
  `);
});

