let mockPath;
const initMocks = () => {
  jest.doMock("path", () => mockPath);
};

describe("relativePathToFile", () => {
  it("removes the absolute portion of the path", async () => {
    mockPath = {
      resolve: jest.fn(
        () => "/Users/foo/Dev/hw-admin/eslint/GqlRules/GqlOperationName/GqlOperationName.js"
      ),
    };
    initMocks();

    const { relativePathToFile } = await import("./relativePathToFile");

    const relativeProjectFilename = "app/javascript/shared/data/queries/foobar.js";

    const filenamePath = relativePathToFile({
      getPhysicalFilename: () => `/Users/foo/Dev/hw-admin/${relativeProjectFilename}`,
    });

    expect(filenamePath).toEqual(relativeProjectFilename);
  });
});
