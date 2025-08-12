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
export declare function parse(content: string): Tree;
export {};
//# sourceMappingURL=index.d.ts.map