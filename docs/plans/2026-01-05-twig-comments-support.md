# Twig Comments Support Implementation Plan

## Overview

Add support for parsing `twig_comment` nodes in the shopware-twig-parser. The tree-sitter grammar (v1.1.0) already produces `twig_comment` nodes, but the parser's converter silently drops them.

## Current State Analysis

### Grammar Support (Working)
The tree-sitter-shopware-twig grammar correctly parses twig comments:

```
Input: {# @deprecated tag:v6.8.0 - Use `mt-button` instead. #}
Output: (template (twig_comment))
```

Comments work at root level and inside HTML elements.

### Parser Bug
In `src/index.ts`, the main parsing loop (lines 385-412) handles:
- `content`
- `html_element`
- `html_doctype`
- `html_entity`
- Falls through to `convertNode()` for other types

The `convertNode()` function only handles `statement_directive`. Therefore, `twig_comment` nodes are silently dropped.

### Key Discoveries:
- Grammar regex: `/\{#[^#]*(?:#[^}][^#]*)*?#\}/` (grammar.js:157)
- Comments can appear at root level and inside HTML elements (`_node` rule, line 82)
- The parser has no `TwigCommentNode` type definition

## Desired End State

**Input:**
```twig
{# @deprecated tag:v6.8.0 - Use `mt-button` instead. #}
<mt-button></mt-button>
```

**Output:**
```json
{
  "rootNode": {
    "type": "template",
    "children": [
      { "type": "twig_comment", "content": "@deprecated tag:v6.8.0 - Use `mt-button` instead." },
      { "type": "html_element", "name": "mt-button", "children": [] }
    ]
  }
}
```

## What We're NOT Doing

- Not modifying the tree-sitter grammar (already works)
- Not adding comment parsing in attribute positions
- Not implementing comment-based directives (just preserving content)

## Implementation Approach

Add a new `TwigCommentNode` type and handle `twig_comment` in both:
1. The root-level parsing loop
2. The `convertHtmlElement` function for comments inside HTML elements

---

## Phase 1: Add Type Definition

### Overview
Define the `TwigCommentNode` type and update union types to include it.

### Changes Required:

#### 1. Add TwigCommentNode type
**File**: `src/index.ts`
**Location**: After line 97 (after `HtmlNumericEntityNode`)

```typescript
type TwigCommentNode = {
  type: "twig_comment";
  content: string;
};
```

#### 2. Update TemplateNode children union
**File**: `src/index.ts`
**Location**: Line 10-17

```typescript
type TemplateNode = {
  type: "template";
  children: (
    | TwigStatementDirectiveNode
    | HtmlElementNode
    | ContentNode
    | HtmlDoctypeNode
    | HtmlNamedEntityNode
    | HtmlNumericEntityNode
    | TwigCommentNode  // ADD THIS
  )[];
};
```

#### 3. Update HtmlElementNode children union
**File**: `src/index.ts`
**Location**: Line 76-81

```typescript
type HtmlElementNode = {
  type: "html_element";
  name: string;
  attributes?: HtmlAttributeNode[];
  children: (
    | HtmlElementNode
    | ContentNode
    | HtmlNamedEntityNode
    | HtmlNumericEntityNode
    | TwigCommentNode  // ADD THIS
  )[];
  void?: boolean;
};
```

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles without errors: `pnpm run build`
- [x] No linting errors (if linter configured)
- [x] Existing tests still pass: `pnpm test`

---

## Phase 2: Add Comment Conversion Function

### Overview
Create a helper function to convert tree-sitter `twig_comment` nodes to our AST format.

### Changes Required:

#### 1. Add convertTwigComment function
**File**: `src/index.ts`
**Location**: After `convertHtmlEntity` function (around line 232)

```typescript
function convertTwigComment(node: any): TwigCommentNode | null {
  if (node.type === "twig_comment") {
    // Extract content between {# and #}
    const text = node.text;
    const content = text.slice(2, -2).trim();
    return {
      type: "twig_comment",
      content,
    };
  }
  return null;
}
```

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles: `pnpm run build`
- [x] Existing tests pass: `pnpm test`

---

## Phase 3: Handle Root-Level Comments

### Overview
Add handling for `twig_comment` in the main parsing loop.

### Changes Required:

#### 1. Update main parsing loop
**File**: `src/index.ts`
**Location**: Lines 385-412, add new branch before the `else` block

```typescript
for (const child of tree.rootNode.children) {
  if (child.type === "content") {
    // ... existing code ...
  } else if (child.type === "html_element") {
    // ... existing code ...
  } else if (child.type === "html_doctype") {
    // ... existing code ...
  } else if (child.type === "html_entity") {
    // ... existing code ...
  } else if (child.type === "twig_comment") {  // ADD THIS BRANCH
    const commentNode = convertTwigComment(child);
    if (commentNode) {
      allNodes.push(commentNode);
    }
  } else {
    // ... existing code (convertNode for statement_directive) ...
  }
}
```

#### 2. Update buildNestedStructure return type
**File**: `src/index.ts`
**Location**: Update the function signature and result handling for `TwigCommentNode`

Add handling in `buildNestedStructure` for `twig_comment` nodes (similar to how `html_named_entity` is handled):

```typescript
} else if (node.type === "twig_comment" && "content" in node) {
  const commentNode = node as TwigCommentNode;

  if (stack.length > 0) {
    const parent = stack[stack.length - 1];
    if (parent && parent.children) {
      parent.children.push(commentNode);
    }
  } else {
    result.push(commentNode);
  }
}
```

### Success Criteria:

#### Automated Verification:
- [x] Build passes: `pnpm run build`
- [x] Existing tests pass: `pnpm test`

#### Manual Verification:
- [ ] Parse `{# comment #}` and verify output includes the comment node

---

## Phase 4: Handle Comments Inside HTML Elements

### Overview
Update `convertHtmlElement` to handle `twig_comment` children.

### Changes Required:

#### 1. Update convertHtmlElement function
**File**: `src/index.ts`
**Location**: Inside the child processing loop (around line 347-364)

```typescript
for (const child of node.children) {
  if (child.type === "content") {
    elementChildren.push({
      type: "content",
      content: child.text,
    });
  } else if (child.type === "html_element") {
    const nestedElement = convertHtmlElement(child);
    if (nestedElement) {
      elementChildren.push(nestedElement);
    }
  } else if (child.type === "html_entity") {
    const entityNode = convertHtmlEntity(child);
    if (entityNode) {
      elementChildren.push(entityNode);
    }
  } else if (child.type === "twig_comment") {  // ADD THIS BRANCH
    const commentNode = convertTwigComment(child);
    if (commentNode) {
      elementChildren.push(commentNode);
    }
  }
}
```

#### 2. Update elementChildren type
**File**: `src/index.ts`
**Location**: Line 339-344

```typescript
const elementChildren: (
  | HtmlElementNode
  | ContentNode
  | HtmlNamedEntityNode
  | HtmlNumericEntityNode
  | TwigCommentNode  // ADD THIS
)[] = [];
```

### Success Criteria:

#### Automated Verification:
- [ ] Build passes: `pnpm run build`
- [ ] Existing tests pass: `pnpm test`

#### Manual Verification:
- [ ] Parse `<div>{# comment #}</div>` and verify comment is in children

---

## Phase 5: Add Tests

### Overview
Add comprehensive tests for twig comment parsing.

### Changes Required:

#### 1. Create test file
**File**: `tests/twig-comments.test.ts`

```typescript
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

  expect(result.rootNode.children[0]).toMatchObject({
    type: "twig_comment",
    content: expect.stringContaining("multiline"),
  });
});

it("parses deprecated annotation in twig comment", () => {
  const result = parse("{# @deprecated tag:v6.8.0 - Use `mt-button` instead. #}");

  expect(result.rootNode.children[0]).toMatchObject({
    type: "twig_comment",
    content: "@deprecated tag:v6.8.0 - Use `mt-button` instead.",
  });
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

  expect(result.rootNode.children[0]).toMatchObject({
    type: "html_element",
    name: "p",
    children: [
      { type: "content", content: expect.stringContaining("You") },
      { type: "twig_comment", content: "part of a line" },
      { type: "content", content: "." },
    ],
  });
});

it("parses twig comment before twig block", () => {
  const result = parse(`{# Comment #}
{% block foo %}{% endblock %}`);

  expect(result.rootNode.children[0]).toMatchObject({
    type: "twig_comment",
  });
  expect(result.rootNode.children[1]).toMatchObject({
    type: "twig_statement_directive",
  });
});

it("parses empty twig comment", () => {
  const result = parse("{##}");

  expect(result.rootNode.children[0]).toMatchObject({
    type: "twig_comment",
    content: "",
  });
});
```

### Success Criteria:

#### Automated Verification:
- [x] All new tests pass: `pnpm test`
- [x] Build succeeds: `pnpm run build`

---

## Testing Strategy

### Unit Tests:
- Simple comment at root level
- Multiline comment
- Comment with special characters (backticks, @, etc.)
- Comment inside HTML element
- Comment inline with text content
- Comment before twig block
- Empty comment
- Multiple consecutive comments

### Edge Cases:
- Comment containing `#` characters
- Comment containing twig-like syntax (should not execute)

## References

- Parser bug report: `docs/parser-test-report.md` (Bug #1)
- Grammar implementation: `tree-sitter-shopware-twig/grammar.js:157`
- Grammar tests: `tree-sitter-shopware-twig/test/corpus/blocks.txt` (lines 131-260)

