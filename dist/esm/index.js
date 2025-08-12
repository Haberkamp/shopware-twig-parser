import Parser from "tree-sitter";
import ShopwareTwig from "tree-sitter-shopware-twig";
const parser = new Parser();
// @ts-expect-error
parser.setLanguage(ShopwareTwig);
export function parse(content) {
    const tree = parser.parse(content);
    function convertNode(node) {
        if (node.type === "statement_directive") {
            const tagStatement = node.children.find((child) => child.type === "tag_statement");
            if (tagStatement) {
                const tagNode = tagStatement.children.find((child) => child.type === "tag");
                const variableNode = tagStatement.children.find((child) => child.type === "variable");
                if (tagNode && tagNode.text === "block" && variableNode) {
                    return {
                        type: "block",
                        name: variableNode.text,
                    };
                }
                else if (tagNode && tagNode.text === "endblock") {
                    return {
                        type: "endblock",
                    };
                }
            }
        }
        return null;
    }
    // First pass: convert all nodes to intermediate format
    const rawNodes = [];
    for (const child of tree.rootNode.children) {
        const converted = convertNode(child);
        if (converted) {
            rawNodes.push(converted);
        }
    }
    // Second pass: build nested structure using a stack
    function buildNestedStructure(nodes) {
        const result = [];
        const stack = [];
        for (const node of nodes) {
            if (node.type === "block") {
                const blockNode = {
                    tag: {
                        type: "twig_tag",
                        name: "block",
                    },
                    type: "twig_statement_directive",
                    variable: {
                        type: "twig_variable",
                        content: node.name,
                    },
                    children: [],
                };
                if (stack.length > 0) {
                    // Add to the current parent's children
                    stack[stack.length - 1]?.children.push(blockNode);
                }
                else {
                    // Add to root level
                    result.push(blockNode);
                }
                // Push to stack for nesting
                stack.push(blockNode);
            }
            else if (node.type === "endblock") {
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
//# sourceMappingURL=index.js.map