import { isGqlFile, isQueryOrMutationFile } from "./isGqlFile";

describe("isGqlFile", () => {
  it("returns false if the filename does not match the gql file extensions", () => {
    expect(isGqlFile({ getFilename: () => "foobar.bla.ts" })).toBeFalsy();
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
    "returns true for filenames with the proper gql file extensions",
    filename => {
      expect(isQueryOrMutationFile({ getFilename: () => filename })).toBeFalsy();
    }
  );
});
