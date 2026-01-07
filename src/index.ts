import Parser from "tree-sitter";
import ShopwareTwig from "tree-sitter-shopware-twig";

type Position = {
  line: number;   // 1-based
  column: number; // 0-based
};

type SourceLocation = {
  start: Position;
  end: Position;
};

type Tree = {
  rootNode: TemplateNode;
};

type TemplateNode = {
  type: "template";
  loc: SourceLocation;
  children: (
    | TwigStatementDirectiveNode
    | HtmlElementNode
    | ContentNode
    | HtmlDoctypeNode
    | HtmlNamedEntityNode
    | HtmlNumericEntityNode
    | TwigCommentNode
    | VueInterpolationNode
  )[];
};

type TwigStatementDirectiveNode = {
  type: "twig_statement_directive";
  loc: SourceLocation;
  tag?: TwigTagNode;
  variable?: TwigVariableNode;
  function?: TwigFunctionNode;
  condition?: TwigConditionNode;
  children?: (
    | TwigStatementDirectiveNode
    | ContentNode
    | HtmlElementNode
    | HtmlDoctypeNode
    | HtmlNamedEntityNode
    | HtmlNumericEntityNode
    | TwigCommentNode
    | VueInterpolationNode
  )[];
};

type TwigConditionNode = {
  type: "twig_condition";
  loc: SourceLocation;
  expression: TwigExpressionNode;
};

type TwigExpressionNode = {
  type: "twig_expression";
  loc: SourceLocation;
  content: string;
};

type ContentNode = {
  type: "content";
  loc: SourceLocation;
  content: string;
};

type TwigTagNode = {
  type: "twig_tag";
  loc: SourceLocation;
  name: string;
};

type TwigVariableNode = {
  type: "twig_variable";
  loc: SourceLocation;
  content: string;
};

type TwigFunctionNode = {
  type: "twig_function";
  loc: SourceLocation;
  name: string;
};

type HtmlAttributeNode = {
  type: "html_attribute";
  loc: SourceLocation;
  name: string;
  value?: string;
};

type HtmlElementNode = {
  type: "html_element";
  loc: SourceLocation;
  name: string;
  attributes?: HtmlAttributeNode[];
  children: (
    | HtmlElementNode
    | ContentNode
    | HtmlNamedEntityNode
    | HtmlNumericEntityNode
    | TwigCommentNode
    | VueInterpolationNode
    | TwigStatementDirectiveNode
  )[];
  void?: boolean;
};

type HtmlDoctypeNode = {
  type: "doctype";
  loc: SourceLocation;
};

type HtmlNamedEntityNode = {
  type: "html_named_entity";
  loc: SourceLocation;
  content: string;
};

type HtmlNumericEntityNode = {
  type: "html_numeric_entity";
  loc: SourceLocation;
  content: string;
};

type TwigCommentNode = {
  type: "twig_comment";
  loc: SourceLocation;
  content: string;
};

type VueInterpolationNode = {
  type: "vue_interpolation";
  loc: SourceLocation;
  expression: string;
};

const parser = new Parser();
// @ts-expect-error
parser.setLanguage(ShopwareTwig);

function getLoc(node: any): SourceLocation {
  return {
    start: {
      line: node.startPosition.row + 1,
      column: node.startPosition.column,
    },
    end: {
      line: node.endPosition.row + 1,
      column: node.endPosition.column,
    },
  };
}

function convertStatementDirective(node: any): {
  type: "block" | "endblock" | "function" | "if" | "endif";
  loc: SourceLocation;
  name?: string;
  functionName?: string;
  expression?: string;
  expressionLoc?: SourceLocation;
  tagLoc?: SourceLocation;
  variableLoc?: SourceLocation;
  functionLoc?: SourceLocation;
} | null {
  if (node.type === "statement_directive") {
    const loc = getLoc(node);
    
    // Check for if_statement
    const ifStatement = node.children.find(
      (child: any) => child.type === "if_statement"
    );
    if (ifStatement) {
      const conditionalNode = ifStatement.children.find(
        (child: any) => child.type === "conditional"
      );
      const variableNode = ifStatement.children.find(
        (child: any) => child.type === "variable"
      );

      if (conditionalNode && conditionalNode.text === "if" && variableNode) {
        return {
          type: "if",
          loc,
          expression: variableNode.text,
          expressionLoc: getLoc(variableNode),
        };
      }
    }

    // Check for tag_statement
    const tagStatement = node.children.find(
      (child: any) => child.type === "tag_statement"
    );
    const functionCall = node.children.find(
      (child: any) => child.type === "function_call"
    );

    if (tagStatement) {
      const tagNode = tagStatement.children.find(
        (child: any) => child.type === "tag"
      );
      const conditionalNode = tagStatement.children.find(
        (child: any) => child.type === "conditional"
      );
      const variableNode = tagStatement.children.find(
        (child: any) => child.type === "variable"
      );

      if (tagNode && tagNode.text === "block" && variableNode) {
        return {
          type: "block",
          loc,
          name: variableNode.text,
          tagLoc: getLoc(tagNode),
          variableLoc: getLoc(variableNode),
        };
      } else if (tagNode && tagNode.text === "endblock") {
        return {
          type: "endblock",
          loc,
        };
      } else if (conditionalNode && conditionalNode.text === "endif") {
        return {
          type: "endif",
          loc,
        };
      }
    } else if (functionCall) {
      const functionIdentifier = functionCall.children.find(
        (child: any) => child.type === "function_identifier"
      );

      if (functionIdentifier) {
        return {
          type: "function",
          loc,
          functionName: functionIdentifier.text,
          functionLoc: getLoc(functionIdentifier),
        };
      }
    }
  }
  return null;
}

export function parse(content: string): Tree {
  const tree = parser.parse(content);

  // First pass: convert all nodes to intermediate format
  const rawNodes: {
    type: "block" | "endblock" | "function" | "if" | "endif";
    loc: SourceLocation;
    name?: string;
    functionName?: string;
    expression?: string;
    expressionLoc?: SourceLocation;
    tagLoc?: SourceLocation;
    variableLoc?: SourceLocation;
    functionLoc?: SourceLocation;
  }[] = [];

  // Also collect content nodes
  const allNodes: Array<
    | {
        type:
          | "block"
          | "endblock"
          | "function"
          | "if"
          | "endif"
          | "content"
          | "html_element"
          | "doctype";
        loc: SourceLocation;
        name?: string;
        functionName?: string;
        expression?: string;
        expressionLoc?: SourceLocation;
        tagLoc?: SourceLocation;
        variableLoc?: SourceLocation;
        functionLoc?: SourceLocation;
        content?: string;
      }
    | HtmlElementNode
    | HtmlNamedEntityNode
    | HtmlNumericEntityNode
    | TwigCommentNode
    | VueInterpolationNode
  > = [];

  function convertHtmlEntity(
    node: any
  ): HtmlNamedEntityNode | HtmlNumericEntityNode | null {
    if (node.type === "html_entity") {
      const entityText = node.text;
      const loc = getLoc(node);

      // Check if it's a numeric entity (starts with &#)
      if (entityText.startsWith("&#")) {
        return {
          type: "html_numeric_entity",
          loc,
          content: entityText,
        };
      } else if (entityText.startsWith("&")) {
        return {
          type: "html_named_entity",
          loc,
          content: entityText,
        };
      }
    }
    return null;
  }

  function convertTwigComment(node: any): TwigCommentNode | null {
    if (node.type === "twig_comment") {
      // Extract content between {# and #}
      const text = node.text;
      const content = text.slice(2, -2).trim();
      return {
        type: "twig_comment",
        loc: getLoc(node),
        content,
      };
    }
    return null;
  }

  function convertVueInterpolation(node: any): VueInterpolationNode | null {
    if (node.type === "vue_interpolation") {
      // Find the interpolation_content child
      const contentNode = node.children.find(
        (child: any) => child.type === "interpolation_content"
      );
      
      return {
        type: "vue_interpolation",
        loc: getLoc(node),
        expression: contentNode ? contentNode.text.trim() : "",
      };
    }
    return null;
  }

  function buildNestedStructureForElement(
    nodes: Array<
      | {
          type:
            | "block"
            | "endblock"
            | "function"
            | "if"
            | "endif"
            | "content"
            | "html_element";
          loc: SourceLocation;
          name?: string;
          functionName?: string;
          expression?: string;
          expressionLoc?: SourceLocation;
          tagLoc?: SourceLocation;
          variableLoc?: SourceLocation;
          functionLoc?: SourceLocation;
          content?: string;
        }
      | HtmlElementNode
      | HtmlNamedEntityNode
      | HtmlNumericEntityNode
      | TwigCommentNode
      | VueInterpolationNode
    >
  ): (
    | HtmlElementNode
    | ContentNode
    | TwigStatementDirectiveNode
    | TwigCommentNode
    | VueInterpolationNode
    | HtmlNamedEntityNode
    | HtmlNumericEntityNode
  )[] {
    const result: (
      | HtmlElementNode
      | ContentNode
      | TwigStatementDirectiveNode
      | TwigCommentNode
      | VueInterpolationNode
      | HtmlNamedEntityNode
      | HtmlNumericEntityNode
    )[] = [];
    const stack: TwigStatementDirectiveNode[] = [];

    for (const node of nodes) {
      if (node.type === "block" && "loc" in node && "tagLoc" in node) {
        const blockNode: TwigStatementDirectiveNode = {
          type: "twig_statement_directive",
          loc: node.loc,
          tag: {
            type: "twig_tag",
            loc: node.tagLoc!,
            name: "block",
          },
          variable: {
            type: "twig_variable",
            loc: node.variableLoc!,
            content: node.name!,
          },
          children: [],
        };

        if (stack.length > 0) {
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(blockNode);
          }
        } else {
          result.push(blockNode);
        }
        stack.push(blockNode);
      } else if (node.type === "endblock") {
        stack.pop();
      } else if (node.type === "if" && "loc" in node && "expressionLoc" in node) {
        const ifNode: TwigStatementDirectiveNode = {
          type: "twig_statement_directive",
          loc: node.loc,
          condition: {
            type: "twig_condition",
            loc: node.loc,
            expression: {
              type: "twig_expression",
              loc: node.expressionLoc!,
              content: node.expression!,
            },
          },
          children: [],
        };

        if (stack.length > 0) {
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(ifNode);
          }
        } else {
          result.push(ifNode);
        }
        stack.push(ifNode);
      } else if (node.type === "endif") {
        stack.pop();
      } else if (node.type === "function" && "loc" in node && "functionLoc" in node) {
        const functionNode: TwigStatementDirectiveNode = {
          type: "twig_statement_directive",
          loc: node.loc,
          function: {
            type: "twig_function",
            loc: node.functionLoc!,
            name: node.functionName!,
          },
        };

        if (stack.length > 0) {
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(functionNode);
          }
        } else {
          result.push(functionNode);
        }
      } else if (node.type === "content" && "loc" in node) {
        const contentNode: ContentNode = {
          type: "content",
          loc: node.loc,
          content: node.content!,
        };

        if (stack.length > 0) {
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(contentNode);
          }
        } else {
          result.push(contentNode);
        }
      } else if (node.type === "html_element" && "name" in node) {
        const htmlNode = node as HtmlElementNode;

        if (stack.length > 0) {
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(htmlNode);
          }
        } else {
          result.push(htmlNode);
        }
      } else if (node.type === "html_named_entity" && "content" in node) {
        const entityNode = node as HtmlNamedEntityNode;

        if (stack.length > 0) {
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(entityNode);
          }
        } else {
          result.push(entityNode);
        }
      } else if (node.type === "html_numeric_entity" && "content" in node) {
        const entityNode = node as HtmlNumericEntityNode;

        if (stack.length > 0) {
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(entityNode);
          }
        } else {
          result.push(entityNode);
        }
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
    }

    return result;
  }

  function convertScriptElement(node: any): HtmlElementNode | null {
    if (node.type !== "script_element" && node.type !== "style_element") {
      return null;
    }

    // Find the start tag
    const startTag = node.children.find(
      (child: any) => child.type === "html_start_tag"
    );
    if (!startTag) return null;

    const tagName = startTag.children.find(
      (child: any) => child.type === "html_tag_name"
    );
    if (!tagName) return null;

    // Parse attributes
    const attributes: HtmlAttributeNode[] = [];
    const attributeNodes = startTag.children.filter(
      (child: any) => child.type === "html_attribute"
    );

    for (const attrNode of attributeNodes) {
      const nameNode = attrNode.children.find(
        (child: any) => child.type === "html_attribute_name"
      );
      if (!nameNode) continue;

      const valueNode = attrNode.children.find(
        (child: any) => child.type === "html_attribute_value"
      );
      const quotedValueNode = attrNode.children.find(
        (child: any) => child.type === "html_quoted_attribute_value"
      );

      let value: string | undefined;
      if (quotedValueNode) {
        const innerValueNode = quotedValueNode.children.find(
          (child: any) => child.type === "html_attribute_value"
        );
        value = innerValueNode ? innerValueNode.text : undefined;
      } else if (valueNode) {
        value = valueNode.text;
      }

      const attribute: HtmlAttributeNode = {
        type: "html_attribute",
        loc: getLoc(attrNode),
        name: nameNode.text,
      };

      if (value !== undefined) {
        attribute.value = value;
      }

      attributes.push(attribute);
    }

    // Get raw text content
    const rawText = node.children.find(
      (child: any) => child.type === "raw_text"
    );

    const children: (ContentNode | HtmlElementNode | HtmlNamedEntityNode | HtmlNumericEntityNode | TwigCommentNode | VueInterpolationNode | TwigStatementDirectiveNode)[] = [];
    if (rawText && rawText.text) {
      children.push({
        type: "content",
        loc: getLoc(rawText),
        content: rawText.text,
      });
    }

    const result: HtmlElementNode = {
      type: "html_element",
      loc: getLoc(node),
      name: tagName.text,
      children,
    };

    if (attributes.length > 0) {
      result.attributes = attributes;
    }

    return result;
  }

  function convertHtmlElement(node: any): HtmlElementNode | null {
    if (node.type === "html_element") {
      // Check for self-closing tag first
      const selfClosingTag = node.children.find(
        (child: any) => child.type === "html_self_closing_tag"
      );

      // Check for void tag
      const voidTag = node.children.find(
        (child: any) => child.type === "html_void_tag"
      );

      // Find the start tag to get the element name
      const startTag = node.children.find(
        (child: any) => child.type === "html_start_tag"
      );

      // Use self-closing tag, void tag, or start tag in that order of preference
      const tagToUse = selfClosingTag || voidTag || startTag;
      if (!tagToUse) return null;

      let tagName: any;
      if (voidTag) {
        // For void tags, the tag name is nested inside html_start_tag within the void tag
        const voidStartTag = voidTag.children.find(
          (child: any) => child.type === "html_start_tag"
        );
        tagName = voidStartTag?.children.find(
          (child: any) => child.type === "html_tag_name"
        );
      } else {
        // For regular and self-closing tags, tag name is directly in the tag
        tagName = tagToUse.children.find(
          (child: any) => child.type === "html_tag_name"
        );
      }
      if (!tagName) return null;

      // Check if this is a void element
      const hasVoidTag = node.children.some(
        (child: any) => child.type === "html_void_tag"
      );
      const hasSelfClosingTag = node.children.some(
        (child: any) => child.type === "html_self_closing_tag"
      );
      const isVoid = hasVoidTag || hasSelfClosingTag;

      // Parse attributes from the tag (either self-closing or start tag)
      const attributes: HtmlAttributeNode[] = [];
      let attributeNodes;

      if (voidTag) {
        // For void tags, attributes are in the nested html_start_tag
        const voidStartTag = voidTag.children.find(
          (child: any) => child.type === "html_start_tag"
        );
        attributeNodes = voidStartTag
          ? voidStartTag.children.filter(
              (child: any) => child.type === "html_attribute"
            )
          : [];
      } else {
        // For regular and self-closing tags, attributes are directly in the tag
        attributeNodes = tagToUse.children.filter(
          (child: any) => child.type === "html_attribute"
        );
      }

      for (const attrNode of attributeNodes) {
        const nameNode = attrNode.children.find(
          (child: any) => child.type === "html_attribute_name"
        );
        if (!nameNode) continue;

        const valueNode = attrNode.children.find(
          (child: any) => child.type === "html_attribute_value"
        );
        const quotedValueNode = attrNode.children.find(
          (child: any) => child.type === "html_quoted_attribute_value"
        );

        let value: string | undefined;
        if (quotedValueNode) {
          // For quoted values, find the inner html_attribute_value
          const innerValueNode = quotedValueNode.children.find(
            (child: any) => child.type === "html_attribute_value"
          );
          value = innerValueNode ? innerValueNode.text : undefined;
        } else if (valueNode) {
          value = valueNode.text;
        }

        const attribute: HtmlAttributeNode = {
          type: "html_attribute",
          loc: getLoc(attrNode),
          name: nameNode.text,
        };

        // Only include value property if there's actually a value
        if (value !== undefined) {
          attribute.value = value;
        }

        attributes.push(attribute);
      }

      // Collect raw children first (before nesting processing)
      const rawChildren: Array<
        | {
            type:
              | "block"
              | "endblock"
              | "function"
              | "if"
              | "endif"
              | "content"
              | "html_element";
            loc: SourceLocation;
            name?: string;
            functionName?: string;
            expression?: string;
            expressionLoc?: SourceLocation;
            tagLoc?: SourceLocation;
            variableLoc?: SourceLocation;
            functionLoc?: SourceLocation;
            content?: string;
          }
        | HtmlElementNode
        | HtmlNamedEntityNode
        | HtmlNumericEntityNode
        | TwigCommentNode
        | VueInterpolationNode
      > = [];

      // Process all children that are not start/end tags
      for (const child of node.children) {
        if (child.type === "content") {
          rawChildren.push({
            type: "content",
            loc: getLoc(child),
            content: child.text,
          });
        } else if (child.type === "html_element") {
          const nestedElement = convertHtmlElement(child);
          if (nestedElement) {
            rawChildren.push(nestedElement);
          }
        } else if (child.type === "html_entity") {
          const entityNode = convertHtmlEntity(child);
          if (entityNode) {
            rawChildren.push(entityNode);
          }
        } else if (child.type === "twig_comment") {
          const commentNode = convertTwigComment(child);
          if (commentNode) {
            rawChildren.push(commentNode);
          }
        } else if (child.type === "vue_interpolation") {
          const interpolationNode = convertVueInterpolation(child);
          if (interpolationNode) {
            rawChildren.push(interpolationNode);
          }
        } else if (child.type === "statement_directive") {
          const converted = convertStatementDirective(child);
          if (converted) {
            rawChildren.push(converted);
          }
        }
      }

      // Apply block nesting within this HTML element's scope
      const elementChildren = buildNestedStructureForElement(rawChildren);

      const result: HtmlElementNode = {
        type: "html_element",
        loc: getLoc(node),
        name: tagName.text,
        children: elementChildren,
      };

      if (attributes.length > 0) {
        result.attributes = attributes;
      }

      if (isVoid) {
        result.void = true;
      }

      return result;
    }
    return null;
  }

  for (const child of tree.rootNode.children) {
    if (child.type === "content") {
      allNodes.push({
        type: "content",
        loc: getLoc(child),
        content: child.text,
      });
    } else if (child.type === "html_element") {
      const htmlElement = convertHtmlElement(child);
      if (htmlElement) {
        allNodes.push(htmlElement);
      }
    } else if (child.type === "script_element" || child.type === "style_element") {
      const scriptElement = convertScriptElement(child);
      if (scriptElement) {
        allNodes.push(scriptElement);
      }
    } else if (child.type === "html_doctype") {
      allNodes.push({
        type: "doctype",
        loc: getLoc(child),
      });
    } else if (child.type === "html_entity") {
      const entityNode = convertHtmlEntity(child);
      if (entityNode) {
        allNodes.push(entityNode);
      }
    } else if (child.type === "twig_comment") {
      const commentNode = convertTwigComment(child);
      if (commentNode) {
        allNodes.push(commentNode);
      }
    } else if (child.type === "vue_interpolation") {
      const interpolationNode = convertVueInterpolation(child);
      if (interpolationNode) {
        allNodes.push(interpolationNode);
      }
    } else {
      const converted = convertStatementDirective(child);
      if (converted) {
        rawNodes.push(converted);
        allNodes.push(converted);
      }
    }
  }

  // Second pass: build nested structure using a stack
  function buildNestedStructure(
    nodes: Array<
      | {
          type:
            | "block"
            | "endblock"
            | "function"
            | "if"
            | "endif"
            | "content"
            | "html_element"
            | "doctype";
          loc: SourceLocation;
          name?: string;
          functionName?: string;
          expression?: string;
          expressionLoc?: SourceLocation;
          tagLoc?: SourceLocation;
          variableLoc?: SourceLocation;
          functionLoc?: SourceLocation;
          content?: string;
        }
      | HtmlElementNode
      | HtmlNamedEntityNode
      | HtmlNumericEntityNode
      | TwigCommentNode
      | VueInterpolationNode
    >
  ): (
    | TwigStatementDirectiveNode
    | HtmlElementNode
    | ContentNode
    | HtmlDoctypeNode
    | HtmlNamedEntityNode
    | HtmlNumericEntityNode
    | TwigCommentNode
    | VueInterpolationNode
  )[] {
    const result: (
      | TwigStatementDirectiveNode
      | HtmlElementNode
      | ContentNode
      | HtmlDoctypeNode
      | HtmlNamedEntityNode
      | HtmlNumericEntityNode
      | TwigCommentNode
      | VueInterpolationNode
    )[] = [];
    const stack: TwigStatementDirectiveNode[] = [];

    for (const node of nodes) {
      if (node.type === "block" && "loc" in node && "tagLoc" in node) {
        const blockNode: TwigStatementDirectiveNode = {
          tag: {
            type: "twig_tag",
            loc: node.tagLoc!,
            name: "block",
          },
          type: "twig_statement_directive",
          loc: node.loc,
          variable: {
            type: "twig_variable",
            loc: node.variableLoc!,
            content: node.name!,
          },
          children: [],
        };

        if (stack.length > 0) {
          // Add to the current parent's children
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(blockNode);
          }
        } else {
          // Add to root level
          result.push(blockNode);
        }

        // Push to stack for nesting
        stack.push(blockNode);
      } else if (node.type === "endblock") {
        // Pop from stack when we encounter an endblock
        stack.pop();
      } else if (node.type === "if" && "loc" in node && "expressionLoc" in node) {
        const ifNode: TwigStatementDirectiveNode = {
          type: "twig_statement_directive",
          loc: node.loc,
          condition: {
            type: "twig_condition",
            loc: node.loc,
            expression: {
              type: "twig_expression",
              loc: node.expressionLoc!,
              content: node.expression!,
            },
          },
          children: [],
        };

        if (stack.length > 0) {
          // Add to the current parent's children
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(ifNode);
          }
        } else {
          // Add to root level
          result.push(ifNode);
        }

        // Push to stack for nesting
        stack.push(ifNode);
      } else if (node.type === "endif") {
        // Pop from stack when we encounter an endif
        stack.pop();
      } else if (node.type === "function" && "loc" in node && "functionLoc" in node) {
        const functionNode: TwigStatementDirectiveNode = {
          type: "twig_statement_directive",
          loc: node.loc,
          function: {
            type: "twig_function",
            loc: node.functionLoc!,
            name: node.functionName!,
          },
        };

        if (stack.length > 0) {
          // Add to the current parent's children
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(functionNode);
          }
        } else {
          // Add to root level
          result.push(functionNode);
        }
      } else if (node.type === "content" && "loc" in node) {
        const contentNode: ContentNode = {
          type: "content",
          loc: node.loc,
          content: node.content!,
        };

        if (stack.length > 0) {
          // Add to the current parent's children
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(contentNode);
          }
        } else {
          // Content at root level - this shouldn't happen in well-formed templates
          // but we'll handle it gracefully
          result.push({
            type: "twig_statement_directive",
            loc: node.loc,
            children: [contentNode],
          });
        }
      } else if (node.type === "html_element" && "name" in node) {
        // HTML elements are already processed and can be added directly
        const htmlNode = node as HtmlElementNode;

        if (stack.length > 0) {
          // Add to the current parent's children
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(htmlNode);
          }
        } else {
          // Add to root level
          result.push(htmlNode);
        }
      } else if (node.type === "doctype" && "loc" in node) {
        const doctypeNode: HtmlDoctypeNode = {
          type: "doctype",
          loc: node.loc,
        };

        if (stack.length > 0) {
          // Add to the current parent's children
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(doctypeNode);
          }
        } else {
          // Add to root level
          result.push(doctypeNode);
        }
      } else if (node.type === "html_named_entity" && "content" in node) {
        const entityNode = node as HtmlNamedEntityNode;

        if (stack.length > 0) {
          // Add to the current parent's children
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(entityNode);
          }
        } else {
          // Add to root level
          result.push(entityNode);
        }
      } else if (node.type === "html_numeric_entity" && "content" in node) {
        const entityNode = node as HtmlNumericEntityNode;

        if (stack.length > 0) {
          // Add to the current parent's children
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(entityNode);
          }
        } else {
          // Add to root level
          result.push(entityNode);
        }
      } else if (node.type === "twig_comment" && "content" in node) {
        const commentNode = node as TwigCommentNode;

        if (stack.length > 0) {
          // Add to the current parent's children
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(commentNode);
          }
        } else {
          // Add to root level
          result.push(commentNode);
        }
      } else if (node.type === "vue_interpolation" && "expression" in node) {
        const interpolationNode = node as VueInterpolationNode;

        if (stack.length > 0) {
          // Add to the current parent's children
          const parent = stack[stack.length - 1];
          if (parent && parent.children) {
            parent.children.push(interpolationNode);
          }
        } else {
          // Add to root level
          result.push(interpolationNode);
        }
      }
    }

    return result;
  }

  const children = buildNestedStructure(allNodes);

  return {
    rootNode: {
      type: "template",
      loc: getLoc(tree.rootNode),
      children,
    },
  };
}
