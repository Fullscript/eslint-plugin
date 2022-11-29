const operationName = (gqlOperationText, operationType) => {
  return gqlOperationText.replace(
    new RegExp(`^${operationType.toLowerCase()}|\\s+|\\(.*\\)?|\\{?`, "g"),
    ""
  );
};

export { operationName };
