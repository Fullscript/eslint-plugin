const isGqlFile = context => {
  const filename = context.getFilename();
  return !!filename.match(/\.(mutation|query|fragment|subscription)\.(ts|tsx)$/);
};

const isNativeGqlFile = context => {
  const filename = context.getFilename();
  return !!filename.match(/\.(mutation|query|fragment|subscription)\.(gql|graphql)$/);
};

const isQueryOrMutationFile = context => {
  const filename = context.getFilename();
  return !!filename.match(/\.(mutation|query)\.(ts|tsx|gql|graphql)$/);
};

export { isNativeGqlFile, isGqlFile, isQueryOrMutationFile };
