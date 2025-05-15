import { isGqlFile, isNativeGqlFile, isQueryOrMutationFile } from "./isGqlFile";

describe("isGqlFile", () => {
  it.each(["bla.foo.ts", "bla.query.gql"])("returns false if the filename does not match the TS gql file extensions", filename => {
    expect(isGqlFile({ getFilename: () => filename })).toBeFalsy();
  });

  it.each([
    "foobar.mutation.ts",
    "foobar.query.tsx",
    "foobar.fragment.ts",
    "foobar.subscription.tsx",
  ])("returns true for filenames with the proper gql file extensions", filename => {
    expect(isGqlFile({ getFilename: () => filename })).toBeTruthy();
  });
});

describe("isNativeGqlFile", () => {
  it("returns false if the filename does not match the gql file extensions", () => {
    expect(isNativeGqlFile({ getFilename: () => "bla.query.ts" })).toBeFalsy();
  });

  it.each([
    "foobar.mutation.gql",
    "foobar.query.gql",
    "foobar.query.graphql",
    "foobar.fragment.gql",
    "foobar.subscription.gql",
  ])("returns true for filenames with the proper gql file extensions", filename => {
    expect(isNativeGqlFile({ getFilename: () => filename })).toBeTruthy();
  });
});

describe("isQueryOrMutationFile", () => {
  it("returns false if the filename does not match the gql file extensions", () => {
    expect(isQueryOrMutationFile({ getFilename: () => "foobar.bla.ts" })).toBeFalsy();
  });

  it.each(["foobar.mutation.ts", "foobar.query.tsx"])(
    "returns true for filenames with the proper gql file extensions",
    filename => {
      expect(isQueryOrMutationFile({ getFilename: () => filename })).toBeTruthy();
    }
  );

  it.each(["foobar.fragment.ts", "foobar.subscription.tsx"])(
    "returns true for filenames with the proper TS gql file extensions",
    filename => {
      expect(isQueryOrMutationFile({ getFilename: () => filename })).toBeFalsy();
    }
  );
});
