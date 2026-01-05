# Vue Interpolation Support Implementation Plan

## Overview

Add support for parsing `vue_interpolation` nodes (mustache syntax `{{ }}`) in the shopware-twig-parser. The tree-sitter grammar (v1.1.0) already produces `vue_interpolation` nodes with `interpolation_content`, but the parser silently drops them.

This plan addresses **Bug #2** (Vue text interpolation lost) and **Bug #3** (Vue interpolation in mixed content lost).

## Current State Analysis

### Grammar Support (Working)
The tree-sitter-shopware-twig grammar correctly parses Vue interpolation:

```
Input: <p>Hello {{ name }}</p>
Output: (template
  (html_element
    (html_start_tag (html_tag_name))
    (content)
    (vue_interpolation (interpolation_content))
    (html_end_tag (html_tag_name))))
```

The grammar handles:
- Simple interpolation: `{{ name }}`
- Property access: `{{ user.profile.name }}`
- Method calls: `{{ formatDate(timestamp) }}`
- Ternary expressions: `{{ isActive ? 'Yes' : 'No' }}`
- Object literals: `{{ { active: isActive } }}`
- Multiple interpolations in one element
- Root-level interpolation

### Parser Bug
In `src/index.ts`:
1. **Root level**: The main loop (lines 385-412) doesn't handle `vue_interpolation`
2. **Inside HTML**: `convertHtmlElement()` (lines 347-364) only processes `content`, `html_element`, and `html_entity`

### Key Discoveries:
- Grammar definition: `grammar.js:159-164`
- Node structure: `vue_interpolation` contains optional `interpolation_content`
- The parser has no `VueInterpolationNode` type definition

## Desired End State

**Input:**
```html
<h2>Hello {{ name }} World</h2>
```

**Output:**
```json
{
  "rootNode": {
    "type": "template",
    "children": [{
      "type": "html_element",
      "name": "h2",
      "children": [
        { "type": "content", "content": "Hello" },
        { "type": "vue_interpolation", "expression": "name" },
        { "type": "content", "content": "World" }
      ]
    }]
  }
}
```

## What We're NOT Doing

- Not modifying the tree-sitter grammar (already works)
- Not parsing/evaluating the JavaScript expressions inside interpolation
- Not handling interpolation in attribute values (already work as strings)

## Implementation Approach

Add a new `VueInterpolationNode` type and handle `vue_interpolation` in:
1. The root-level parsing loop
2. The `convertHtmlElement` function
3. The `buildNestedStructure` function

---

## Phase 1: Add Type Definition

### Overview
Define the `VueInterpolationNode` type and update union types.

### Changes Required:

#### 1. Add VueInterpolationNode type
**File**: `src/index.ts`
**Location**: After `TwigCommentNode` type (or after line 97)

```typescript
type VueInterpolationNode = {
  type: "vue_interpolation";
  expression: string;
};
```

#### 2. Update TemplateNode children union
**File**: `src/index.ts`
**Location**: Lines 10-17

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
    | TwigCommentNode
    | VueInterpolationNode  // ADD THIS
  )[];
};
```

#### 3. Update HtmlElementNode children union
**File**: `src/index.ts`
**Location**: Lines 76-81

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
    | TwigCommentNode
    | VueInterpolationNode  // ADD THIS
  )[];
  void?: boolean;
};
```

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles: `pnpm run build`
- [x] Existing tests pass: `pnpm test`

---

## Phase 2: Add Interpolation Conversion Function

### Overview
Create a helper function to convert tree-sitter `vue_interpolation` nodes.

### Changes Required:

#### 1. Add convertVueInterpolation function
**File**: `src/index.ts`
**Location**: After `convertTwigComment` function

```typescript
function convertVueInterpolation(node: any): VueInterpolationNode | null {
  if (node.type === "vue_interpolation") {
    // Find the interpolation_content child
    const contentNode = node.children.find(
      (child: any) => child.type === "interpolation_content"
    );
    
    return {
      type: "vue_interpolation",
      expression: contentNode ? contentNode.text.trim() : "",
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

## Phase 3: Handle Root-Level Interpolation

### Overview
Add handling for `vue_interpolation` in the main parsing loop.

### Changes Required:

#### 1. Update main parsing loop
**File**: `src/index.ts`
**Location**: Lines 385-412, add new branch

```typescript
for (const child of tree.rootNode.children) {
  if (child.type === "content") {
    // ... existing ...
  } else if (child.type === "html_element") {
    // ... existing ...
  } else if (child.type === "html_doctype") {
    // ... existing ...
  } else if (child.type === "html_entity") {
    // ... existing ...
  } else if (child.type === "twig_comment") {
    // ... existing ...
  } else if (child.type === "vue_interpolation") {  // ADD THIS
    const interpolationNode = convertVueInterpolation(child);
    if (interpolationNode) {
      allNodes.push(interpolationNode);
    }
  } else {
    // ... existing (statement_directive handling) ...
  }
}
```

#### 2. Update allNodes type annotation
**File**: `src/index.ts`
**Location**: Around line 191-210

Add `VueInterpolationNode` to the `allNodes` array type.

#### 3. Update buildNestedStructure
**File**: `src/index.ts`
**Location**: Inside `buildNestedStructure` function

Add handling for vue_interpolation nodes:

```typescript
} else if (node.type === "vue_interpolation" && "expression" in node) {
  const interpolationNode = node as VueInterpolationNode;

  if (stack.length > 0) {
    const parent = stack[stack.length - 1];
    if (parent && parent.children) {
      parent.children.push(interpolationNode);
    }
  } else {
    result.push(interpolationNode);
  }
}
```

### Success Criteria:

#### Automated Verification:
- [x] Build passes: `pnpm run build`
- [x] Existing tests pass: `pnpm test`

#### Manual Verification:
- [ ] Parse `{{ message }}` at root level and verify output

---

## Phase 4: Handle Interpolation Inside HTML Elements

### Overview
Update `convertHtmlElement` to handle `vue_interpolation` children.

### Changes Required:

#### 1. Update convertHtmlElement child processing
**File**: `src/index.ts`
**Location**: Inside the child processing loop (lines 347-364)

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
  } else if (child.type === "twig_comment") {
    const commentNode = convertTwigComment(child);
    if (commentNode) {
      elementChildren.push(commentNode);
    }
  } else if (child.type === "vue_interpolation") {  // ADD THIS
    const interpolationNode = convertVueInterpolation(child);
    if (interpolationNode) {
      elementChildren.push(interpolationNode);
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
  | TwigCommentNode
  | VueInterpolationNode  // ADD THIS
)[] = [];
```

### Success Criteria:

#### Automated Verification:
- [x] Build passes: `pnpm run build`
- [x] Existing tests pass: `pnpm test`

#### Manual Verification:
- [ ] Parse `<h2>{{ title }}</h2>` and verify interpolation in children
- [ ] Parse `<h2>Hello {{ name }} World</h2>` and verify mixed content preserved

---

## Phase 5: Add Tests

### Overview
Add comprehensive tests for Vue interpolation parsing.

### Changes Required:

#### 1. Create test file
**File**: `tests/vue-interpolation.test.ts`

```typescript
import { it, expect } from "vitest";
import { parse } from "../src/index.js";

it("parses vue interpolation inside element", () => {
  const result = parse("<h2>{{ title }}</h2>");

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
  const result = parse("<h2>Hello {{ name }} World</h2>");

  expect(result.rootNode.children[0]).toMatchObject({
    type: "html_element",
    name: "h2",
    children: [
      { type: "content", content: "Hello" },
      { type: "vue_interpolation", expression: "name" },
      { type: "content", content: "World" },
    ],
  });
});

it("parses vue interpolation with property access", () => {
  const result = parse("<span>{{ user.profile.name }}</span>");

  expect(result.rootNode.children[0].children[0]).toMatchObject({
    type: "vue_interpolation",
    expression: "user.profile.name",
  });
});

it("parses vue interpolation with method call", () => {
  const result = parse("<span>{{ formatDate(timestamp) }}</span>");

  expect(result.rootNode.children[0].children[0]).toMatchObject({
    type: "vue_interpolation",
    expression: "formatDate(timestamp)",
  });
});

it("parses vue interpolation with ternary operator", () => {
  const result = parse("<span>{{ isActive ? 'Yes' : 'No' }}</span>");

  expect(result.rootNode.children[0].children[0]).toMatchObject({
    type: "vue_interpolation",
    expression: "isActive ? 'Yes' : 'No'",
  });
});

it("parses vue interpolation with translation function", () => {
  const result = parse("<h2>{{ $t('sw-theme-manager.general.mainMenuItemGeneral') }}</h2>");

  expect(result.rootNode.children[0].children[0]).toMatchObject({
    type: "vue_interpolation",
    expression: "$t('sw-theme-manager.general.mainMenuItemGeneral')",
  });
});

it("parses multiple vue interpolations in one element", () => {
  const result = parse("<p>{{ greeting }}, {{ name }}!</p>");

  expect(result.rootNode.children[0]).toMatchObject({
    type: "html_element",
    name: "p",
    children: [
      { type: "vue_interpolation", expression: "greeting" },
      { type: "content", content: "," },
      { type: "vue_interpolation", expression: "name" },
      { type: "content", content: "!" },
    ],
  });
});

it("parses vue interpolation at root level", () => {
  const result = parse("{{ message }}");

  expect(result.rootNode.children[0]).toMatchObject({
    type: "vue_interpolation",
    expression: "message",
  });
});

it("parses empty vue interpolation", () => {
  const result = parse("<p>{{}}</p>");

  expect(result.rootNode.children[0].children[0]).toMatchObject({
    type: "vue_interpolation",
    expression: "",
  });
});

it("parses vue interpolation with object literal", () => {
  const result = parse("<span>{{ { active: isActive, disabled: !enabled } }}</span>");

  expect(result.rootNode.children[0].children[0]).toMatchObject({
    type: "vue_interpolation",
    expression: expect.stringContaining("active: isActive"),
  });
});

it("parses vue interpolation in nested elements", () => {
  const result = parse(`
    <div>
      <span>{{ label }}</span>
    </div>
  `);

  const div = result.rootNode.children.find(
    (c: any) => c.type === "html_element" && c.name === "div"
  );
  const span = div.children.find(
    (c: any) => c.type === "html_element" && c.name === "span"
  );
  
  expect(span.children[0]).toMatchObject({
    type: "vue_interpolation",
    expression: "label",
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
- Simple interpolation: `{{ name }}`
- Property access: `{{ user.name }}`
- Method calls: `{{ format(x) }}`
- Ternary expressions
- Translation function calls: `{{ $t('key') }}`
- Multiple interpolations in one element
- Mixed text and interpolation
- Root-level interpolation
- Empty interpolation
- Object/array literals in interpolation

### Edge Cases:
- Interpolation containing `}}` in string
- Template literals with `${}` inside
- Deeply nested elements with interpolation

## Performance Considerations

None - this is a simple traversal addition, no performance impact expected.

## References

- Parser bug report: `docs/parser-test-report.md` (Bug #2, Bug #3)
- Grammar implementation: `tree-sitter-shopware-twig/grammar.js:159-164`
- Grammar tests: `tree-sitter-shopware-twig/test/corpus/html.txt` (lines 799-981)

