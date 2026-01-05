# Pre Tag Whitespace Preservation

## Problem

The parser does not preserve inter-element whitespace inside `<pre>` tags. This makes it impossible for the prettier plugin to output pre content exactly as it appeared in the source.

### Example

**Input:**
```html
<pre class="test">
  <code>hello</code>
  text
</pre>
```

**Current AST output:**
```json
{
  "type": "html_element",
  "name": "pre",
  "children": [
    { "type": "html_element", "name": "code", "children": [{ "type": "content", "content": "hello" }] },
    { "type": "content", "content": "text" }
  ]
}
```

The whitespace (`\n  `) between `<pre>` and `<code>`, and between `</code>` and `text`, is lost.

## Root Cause

Two issues in the tree-sitter grammar (`tree-sitter-shopware-twig/grammar.js`):

### 1. `extras` skips whitespace globally

```javascript
// grammar.js line 13
extras: () => [/\s/],  // Tells tree-sitter to skip/ignore whitespace
```

### 2. Content regex excludes leading/trailing whitespace

```javascript
// grammar.js line 42
content: () => prec.right(/[^<>&\{\s]([^<>&\{]*[^<>&\{\s])?/),
//                              ^^                     ^^
//                        excludes whitespace at start/end
```

## Proposed Solution

Store source positions in the AST so the printer can extract original content for whitespace-sensitive elements.

### Parser Changes

Add source position fields to `HtmlElementNode`:

```typescript
type HtmlElementNode = {
  type: "html_element";
  name: string;
  attributes?: HtmlAttributeNode[];
  children: (/* ... */)[];
  void?: boolean;
  // Add source positions
  startIndex?: number;
  endIndex?: number;
};
```

In `convertHtmlElement`, capture positions from tree-sitter:

```typescript
const result: HtmlElementNode = {
  type: "html_element",
  name: tagName.text,
  children: elementChildren,
  startIndex: node.startIndex,
  endIndex: node.endIndex,
};
```

### Printer Changes

For pre-like elements, use original source text:

```javascript
if (isPreLikeElement(elementName) && node.startIndex !== undefined) {
  const originalContent = options.originalText.slice(
    startTagEndIndex,
    endTagStartIndex
  );
  return [`<${elementName}${attrStr}>`, originalContent, `</${elementName}>`];
}
```

## Alternative Solutions

### Option A: Grammar change for pre_element

Add a dedicated `pre_element` rule (like `script_element`/`style_element`) that captures raw text content. Requires external scanner changes.

### Option B: Change content regex

```javascript
content: () => prec.right(/[^<>&\{]+/),  // Include whitespace
```

**Downside:** Captures whitespace everywhere, not just in pre tags.

## Affected Elements

- `<pre>`
- `<textarea>`
- `<listing>` (deprecated)
- `<xmp>` (deprecated)

