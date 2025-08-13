import Parser from "tree-sitter";
import ShopwareTwig from "tree-sitter-shopware-twig";

type Tree = {
  rootNode: TemplateNode;
};

type TemplateNode = {
  type: "template";
  children: TwigStatementDirectiveNode[];
};

type TwigStatementDirectiveNode = {
  type: "twig_statement_directive";
  tag?: TwigTagNode;
  variable?: TwigVariableNode;
  function?: TwigFunctionNode;
  condition?: TwigConditionNode;
  children?: (TwigStatementDirectiveNode | ContentNode)[];
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
  const allNodes: Array<{
    type: "block" | "endblock" | "function" | "if" | "endif" | "content";
    name?: string;
    functionName?: string;
    expression?: string;
    content?: string;
  }> = [];

  for (const child of tree.rootNode.children) {
    if (child.type === "content") {
      allNodes.push({
        type: "content",
        content: child.text,
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
    nodes: Array<{
      type: "block" | "endblock" | "function" | "if" | "endif" | "content";
      name?: string;
      functionName?: string;
      expression?: string;
      content?: string;
    }>
  ): TwigStatementDirectiveNode[] {
    const result: TwigStatementDirectiveNode[] = [];
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
