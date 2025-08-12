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
  tag: TwigTagNode;
  variable: TwigVariableNode;
  children: TwigStatementDirectiveNode[];
};

type TwigTagNode = {
  type: "twig_tag";
  name: string;
};

type TwigVariableNode = {
  type: "twig_variable";
  content: string;
};

const parser = new Parser();
// @ts-expect-error
parser.setLanguage(ShopwareTwig);

export function parse(content: string): Tree {
  const tree = parser.parse(content);

  function convertNode(
    node: any
  ): { type: "block" | "endblock"; name?: string } | null {
    if (node.type === "statement_directive") {
      const tagStatement = node.children.find(
        (child: any) => child.type === "tag_statement"
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
      }
    }
    return null;
  }

  // First pass: convert all nodes to intermediate format
  const rawNodes: { type: "block" | "endblock"; name?: string }[] = [];
  for (const child of tree.rootNode.children) {
    const converted = convertNode(child);
    if (converted) {
      rawNodes.push(converted);
    }
  }

  // Second pass: build nested structure using a stack
  function buildNestedStructure(
    nodes: { type: "block" | "endblock"; name?: string }[]
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
          stack[stack.length - 1]?.children.push(blockNode);
        } else {
          // Add to root level
          result.push(blockNode);
        }

        // Push to stack for nesting
        stack.push(blockNode);
      } else if (node.type === "endblock") {
        // Pop from stack when we encounter an endblock
        stack.pop();
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
