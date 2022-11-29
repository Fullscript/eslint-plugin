const isMutation = gqlOperationText => {
  return gqlOperationText.startsWith("mutation");
};

export { isMutation };
