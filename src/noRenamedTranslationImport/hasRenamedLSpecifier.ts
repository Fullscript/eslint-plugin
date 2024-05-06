const hasRenamedLSpecifier = specifiers => {
  return specifiers?.some(specifier => {
    return specifier.imported.name === "l" && specifier.local.name !== "l";
  });
};

export { hasRenamedLSpecifier };
