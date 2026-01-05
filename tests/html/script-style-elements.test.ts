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
                "type": "content",
              },
            ],
            "name": "script",
            "type": "html_element",
          },
        ],
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
                "name": "type",
                "type": "html_attribute",
                "value": "module",
              },
              {
                "name": "src",
                "type": "html_attribute",
                "value": "app.js",
              },
            ],
            "children": [],
            "name": "script",
            "type": "html_element",
          },
        ],
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
                "type": "content",
              },
            ],
            "name": "style",
            "type": "html_element",
          },
        ],
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
                "name": "scoped",
                "type": "html_attribute",
              },
              {
                "name": "lang",
                "type": "html_attribute",
                "value": "scss",
              },
            ],
            "children": [
              {
                "content": ".foo { color: red; }",
                "type": "content",
              },
            ],
            "name": "style",
            "type": "html_element",
          },
        ],
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
            "name": "script",
            "type": "html_element",
          },
        ],
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
                "type": "content",
              },
            ],
            "name": "div",
            "type": "html_element",
          },
          {
            "children": [
              {
                "content": "alert(1);",
                "type": "content",
              },
            ],
            "name": "script",
            "type": "html_element",
          },
        ],
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
                "type": "content",
              },
            ],
            "name": "script",
            "type": "html_element",
          },
        ],
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
                    "type": "content",
                  },
                ],
                "name": "div",
                "type": "html_element",
              },
            ],
            "name": "template",
            "type": "html_element",
          },
          {
            "children": [
              {
                "content": "export default {}",
                "type": "content",
              },
            ],
            "name": "script",
            "type": "html_element",
          },
          {
            "children": [
              {
                "content": ".app { margin: 0; }",
                "type": "content",
              },
            ],
            "name": "style",
            "type": "html_element",
          },
        ],
        "type": "template",
      },
    }
  `);
});

