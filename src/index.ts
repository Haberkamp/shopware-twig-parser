const Parser = require("tree-sitter");
const ShopwareTwig = require("tree-sitter-shopware-twig");

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
parser.setLanguage(ShopwareTwig);

export function parse(content: string): Tree {
  const tree = parser.parse(content);

  function convertNode(node: any): TwigStatementDirectiveNode | null {
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
            type: "twig_statement_directive",
            tag: {
              type: "twig_tag",
              name: tagNode.text,
            },
            variable: {
              type: "twig_variable",
              content: variableNode.text,
            },
          };
        }
      }
    }
    return null;
  }

  const children: TwigStatementDirectiveNode[] = [];

  for (const child of tree.rootNode.children) {
    const astNode = convertNode(child);
    if (astNode) {
      children.push(astNode);
    }
  }

  return {
    rootNode: {
      type: "template",
      children,
    },
  };
}
