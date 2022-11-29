const isQuery = gqlOperationText => {
  return gqlOperationText.startsWith("query");
};

export { isQuery };
