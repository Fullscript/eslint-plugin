const isGqlFile = context => {
  const filename = context.getFilename();
  return !!filename.match(/\.(mutation|query|fragment|subscription)\.tsx?$/);
};

const isQueryOrMutationFile = context => {
  const filename = context.getFilename();
  return !!filename.match(/\.(mutation|query)\.tsx?$/);
};

export { isGqlFile, isQueryOrMutationFile };
