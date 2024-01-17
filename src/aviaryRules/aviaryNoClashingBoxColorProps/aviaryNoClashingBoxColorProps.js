const meta = {
  type: "problem",
  docs: {
    description: "Prevents isColor and accentColor from being passed to the same Box component",
    category: "no-clashing-box-color-props",
    recommended: false,
  },
  fixable: null,
  schema: [],
};

const create = context => {
  return {
    JSXOpeningElement: node => {
      if (node.name.name !== "Box") return;

      const attributes = node.attributes;

      const isColor = attributes.find(attr => attr.name.name === "isColor");
      const accentColor = attributes.find(attr => attr.name.name === "accentColor");

      if (isColor && accentColor) {
        context.report({
          node,
          message:
            "Do not use both isColor and accentColor in the same Box component. They are clashing props.",
        });
      }
    },
  };
};

export { meta, create };
