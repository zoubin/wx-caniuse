# wx-caniuse
检查仓库中是否使用了指定基础库版本不支持的API

## Install

```js
npm i -g wx-caniuse
wx-caniuse -h

```
## (TSC) TypeScript
### How to disable JSDoc type checking
To disable JSDoc type checking, just make `ts.getJSDocCommentRanges()` always return an empty array.

```js
function createNodeWithJSDoc(kind, pos) {
    var node = createNode(kind, pos);
    if (scanner.getTokenFlags() & 2 /* PrecedingJSDocComment */ && (kind !== 226 /* ExpressionStatement */ || token() !== 20 /* OpenParenToken */)) {
        addJSDocComment(node);
    }
    return node;
}
function addJSDocComment(node) {
    ts.Debug.assert(!node.jsDoc); // Should only be called once per node
    var jsDoc = ts.mapDefined(ts.getJSDocCommentRanges(node, sourceFile.text), function (comment) { return JSDocParser.parseJSDocComment(node, comment.pos, comment.end - comment.pos); });
    if (jsDoc.length)
        node.jsDoc = jsDoc;
    return node;
}

// hook this
function getJSDocCommentRanges(node, text) {
    var commentRanges = (node.kind === 156 /* Parameter */ ||
        node.kind === 155 /* TypeParameter */ ||
        node.kind === 201 /* FunctionExpression */ ||
        node.kind === 202 /* ArrowFunction */ ||
        node.kind === 200 /* ParenthesizedExpression */) ?
        ts.concatenate(ts.getTrailingCommentRanges(text, node.pos), ts.getLeadingCommentRanges(text, node.pos)) :
        ts.getLeadingCommentRanges(text, node.pos);
    // True if the comment starts with '/**' but not if it is '/**/'
    return ts.filter(commentRanges, function (comment) {
        return text.charCodeAt(comment.pos + 1) === 42 /* asterisk */ &&
            text.charCodeAt(comment.pos + 2) === 42 /* asterisk */ &&
            text.charCodeAt(comment.pos + 3) !== 47 /* slash */;
    });
}
ts.getJSDocCommentRanges = getJSDocCommentRanges;

```
