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
                "type": "vue_interpolation",
              },
            ],
            "name": "h2",
            "type": "html_element",
          },
        ],
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
                "type": "content",
              },
              {
                "expression": "name",
                "type": "vue_interpolation",
              },
              {
                "content": "World",
                "type": "content",
              },
            ],
            "name": "h2",
            "type": "html_element",
          },
        ],
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
                "type": "vue_interpolation",
              },
            ],
            "name": "span",
            "type": "html_element",
          },
        ],
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
                "type": "vue_interpolation",
              },
            ],
            "name": "span",
            "type": "html_element",
          },
        ],
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
                "type": "vue_interpolation",
              },
            ],
            "name": "span",
            "type": "html_element",
          },
        ],
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
                "type": "vue_interpolation",
              },
            ],
            "name": "h2",
            "type": "html_element",
          },
        ],
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
                "type": "vue_interpolation",
              },
              {
                "content": ",",
                "type": "content",
              },
              {
                "expression": "name",
                "type": "vue_interpolation",
              },
              {
                "content": "!",
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
            "type": "vue_interpolation",
          },
        ],
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
                "type": "vue_interpolation",
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
                "type": "vue_interpolation",
              },
            ],
            "name": "span",
            "type": "html_element",
          },
        ],
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
                    "type": "vue_interpolation",
                  },
                ],
                "name": "span",
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

