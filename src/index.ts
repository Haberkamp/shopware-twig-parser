import Parser from "tree-sitter";
import ShopwareTwig from "tree-sitter-shopware-twig";

type Tree = {
  rootNode: TemplateNode;
};

type TemplateNode = {
  type: "template";
  children: (
    | TwigStatementDirectiveNode
    | HtmlElementNode
    | ContentNode
    | HtmlDoctypeNode
  )[];
};

type TwigStatementDirectiveNode = {
  type: "twig_statement_directive";
  tag?: TwigTagNode;
  variable?: TwigVariableNode;
  function?: TwigFunctionNode;
  condition?: TwigConditionNode;
  children?: (
    | TwigStatementDirectiveNode
    | ContentNode
    | HtmlElementNode
    | HtmlDoctypeNode
  )[];
};

type TwigConditionNode = {
  type: "twig_condition";
  expression: TwigExpressionNode;
};

type TwigExpressionNode = {
  type: "twig_expression";
  content: string;
};

type ContentNode = {
  type: "content";
  content: string;
};

type TwigTagNode = {
  type: "twig_tag";
  name: string;
};

type TwigVariableNode = {
  type: "twig_variable";
  content: string;
};

type TwigFunctionNode = {
  type: "twig_function";
  name: string;
};

type HtmlAttributeNode = {
  type: "html_attribute";
  name: string;
  value?: string;
};

type HtmlElementNode = {
  type: "html_element";
  name: string;
  attributes?: HtmlAttributeNode[];
  children: (HtmlElementNode | ContentNode)[];
  void?: boolean;
};

type HtmlDoctypeNode = {
  type: "doctype";
};

const parser = new Parser();
// @ts-expect-error
parser.setLanguage(ShopwareTwig);

export function parse(content: string): Tree {
  const tree = parser.parse(content);

  function convertNode(node: any): {
    type: "block" | "endblock" | "function" | "if" | "endif";
    name?: string;
    functionName?: string;
    expression?: string;
  } | null {
    if (node.type === "statement_directive") {
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
            expression: variableNode.text,
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
            name: variableNode.text,
          };
        } else if (tagNode && tagNode.text === "endblock") {
          return {
            type: "endblock",
          };
        } else if (conditionalNode && conditionalNode.text === "endif") {
          return {
            type: "endif",
          };
        }
      } else if (functionCall) {
        const functionIdentifier = functionCall.children.find(
          (child: any) => child.type === "function_identifier"
        );

        if (functionIdentifier) {
          return {
            type: "function",
            functionName: functionIdentifier.text,
          };
        }
      }
    }
    return null;
  }

  // First pass: convert all nodes to intermediate format
  const rawNodes: {
    type: "block" | "endblock" | "function" | "if" | "endif";
    name?: string;
    functionName?: string;
    expression?: string;
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
        name?: string;
        functionName?: string;
        expression?: string;
        content?: string;
      }
    | HtmlElementNode
  > = [];

  function convertHtmlElement(node: any): HtmlElementNode | null {
    if (node.type === "html_element") {
      // Check for self-closing tag first
      const selfClosingTag = node.children.find(
        (child: any) => child.type === "html_self_closing_tag"
      );

      // Find the start tag to get the element name
      const startTag = node.children.find(
        (child: any) => child.type === "html_start_tag"
      );

      // Use self-closing tag if available, otherwise start tag
      const tagToUse = selfClosingTag || startTag;
      if (!tagToUse) return null;

      const tagName = tagToUse.children.find(
        (child: any) => child.type === "html_tag_name"
      );
      if (!tagName) return null;

      // Check if this is a void element (no end tag and not self-closing)
      const hasEndTag = node.children.some(
        (child: any) => child.type === "html_end_tag"
      );
      const isVoid = !hasEndTag;

      // Parse attributes from the tag (either self-closing or start tag)
      const attributes: HtmlAttributeNode[] = [];
      const attributeNodes = tagToUse.children.filter(
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
          name: nameNode.text,
        };

        // Only include value property if there's actually a value
        if (value !== undefined) {
          attribute.value = value;
        }

        attributes.push(attribute);
      }

      const elementChildren: (HtmlElementNode | ContentNode)[] = [];

      // Process all children that are not start/end tags
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
        }
      }

      const result: HtmlElementNode = {
        type: "html_element",
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
        content: child.text,
      });
    } else if (child.type === "html_element") {
      const htmlElement = convertHtmlElement(child);
      if (htmlElement) {
        allNodes.push(htmlElement);
      }
    } else if (child.type === "html_doctype") {
      allNodes.push({
        type: "doctype",
      });
    } else {
      const converted = convertNode(child);
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
          name?: string;
          functionName?: string;
          expression?: string;
          content?: string;
        }
      | HtmlElementNode
    >
  ): (
    | TwigStatementDirectiveNode
    | HtmlElementNode
    | ContentNode
    | HtmlDoctypeNode
  )[] {
    const result: (
      | TwigStatementDirectiveNode
      | HtmlElementNode
      | ContentNode
      | HtmlDoctypeNode
    )[] = [];
    const stack: TwigStatementDirectiveNode[] = [];

    for (const node of nodes) {
      if (node.type === "block") {
        const blockNode: TwigStatementDirectiveNode = {
          tag: {
            type: "twig_tag",
            name: "block",
          },
          type: "twig_statement_directive",
          variable: {
            type: "twig_variable",
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
      } else if (node.type === "if") {
        const ifNode: TwigStatementDirectiveNode = {
          type: "twig_statement_directive",
          condition: {
            type: "twig_condition",
            expression: {
              type: "twig_expression",
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
      } else if (node.type === "function") {
        const functionNode: TwigStatementDirectiveNode = {
          type: "twig_statement_directive",
          function: {
            type: "twig_function",
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
      } else if (node.type === "content") {
        const contentNode: ContentNode = {
          type: "content",
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
      } else if (node.type === "doctype") {
        const doctypeNode: HtmlDoctypeNode = {
          type: "doctype",
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
      }
    }

    return result;
  }

  const children = buildNestedStructure(allNodes);

  return {
    rootNode: {
      type: "template",
      children,
    },
  };
}
