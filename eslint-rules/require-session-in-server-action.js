module.exports = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      missingSession:
        "Server action '{{name}}' is callable by anyone on the internet. Call `getServerSession()` and return early when `session.id` is missing, before any fetch, upload or database access.",
    },
  },
  create(context) {
    let isServerFile = false;
    const exportedActions = [];
    const authenticated = new Set();

    return {
      Program(node) {
        isServerFile = node.body.some(
          (statement) =>
            statement.type === "ExpressionStatement" &&
            statement.directive === "use server",
        );
      },
      ExportNamedDeclaration(node) {
        const declaration = node.declaration;
        if (!isServerFile || !declaration) return;

        if (declaration.type === "FunctionDeclaration") {
          exportedActions.push({ fn: declaration, name: declaration.id.name });
          return;
        }
        if (declaration.type !== "VariableDeclaration") return;

        for (const declarator of declaration.declarations) {
          const init = declarator.init;
          if (
            init &&
            (init.type === "ArrowFunctionExpression" ||
              init.type === "FunctionExpression")
          )
            exportedActions.push({ fn: init, name: declarator.id.name });
        }
      },
      CallExpression(node) {
        if (node.callee.name !== "getServerSession") return;
        for (const ancestor of context.sourceCode.getAncestors(node)) authenticated.add(ancestor);
      },
      "Program:exit"() {
        for (const { fn, name } of exportedActions) {
          if (!authenticated.has(fn))
            context.report({ node: fn, messageId: "missingSession", data: { name } });
        }
      },
    };
  },
};
