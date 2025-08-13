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
  children?: TwigStatementDirectiveNode[];
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
    type: "block" | "endblock" | "function";
    name?: string;
    functionName?: string;
  } | null {
    if (node.type === "statement_directive") {
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
    type: "block" | "endblock" | "function";
    name?: string;
    functionName?: string;
  }[] = [];
  for (const child of tree.rootNode.children) {
    const converted = convertNode(child);
    if (converted) {
      rawNodes.push(converted);
    }
  }

  // Second pass: build nested structure using a stack
  function buildNestedStructure(
    nodes: {
      type: "block" | "endblock" | "function";
      name?: string;
      functionName?: string;
    }[]
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
      }
    }

    return result;
  }

  const children = buildNestedStructure(rawNodes);

  return {
    rootNode: {
      type: "template",
      children,
    },
  };
}
