import { isEmpty, isTranslationFile, searchForBannedWords } from "./noBannedTranslationWords";

const createMockContext = (options = [], getFilename = jest.fn(), report = jest.fn()) => ({
  options,
  getFilename,
  report,
});

describe("noBannedTranslationWords", () => {
  describe("isEmpty", () => {
    it("returns true when the array is empty", () => {
      expect(isEmpty([])).toBe(true);
    });

    it("returns false when the array is not empty", () => {
      expect(isEmpty(["something"])).toBe(false);
    });
  });

  describe("searchForBannedWords", () => {
    it("returns an empty array when there are no banned words", () => {
      const bannedWords = ["foo", "bar"];
      const value = "baz";

      expect(searchForBannedWords(bannedWords, value)).toEqual([]);
    });

    it("returns banned words which match", () => {
      const bannedWords = ["foo", "bar"];
      const value = "foo";

      expect(searchForBannedWords(bannedWords, value)).toEqual(["foo"]);
    });

    it("matches case insensitive", () => {
      const bannedWords = ["foo", "bar"];
      const value = "FOO";

      expect(searchForBannedWords(bannedWords, value)).toEqual(["FOO"]);
    });

    it("matches words followed by punctuation", () => {
      const bannedWords = ["foo", "bar"];
      const value = "FOO! bar.";

      expect(searchForBannedWords(bannedWords, value)).toEqual(["FOO", "bar"]);
    });

    it("matches hyphenated words", () => {
      const bannedWords = ["foo", "bar"];
      const value = "foo-bar";

      expect(searchForBannedWords(bannedWords, value)).toEqual(["foo", "bar"]);
    });

    it("matches pipe delimited words", () => {
      const bannedWords = ["foo", "bar"];
      const value = "foo|bar|baz";

      expect(searchForBannedWords(bannedWords, value)).toEqual(["foo", "bar"]);
    });

    it("matches comma delimited words", () => {
      const bannedWords = ["foo", "bar"];
      const value = "foo,bar,baz";

      expect(searchForBannedWords(bannedWords, value)).toEqual(["foo", "bar"]);
    });
  });

  describe("isTranslationFile", () => {
    it("returns true for any path when no directories nor extensions specified", () => {
      const mockOptions = [];
      const mockGetFilename = jest.fn().mockReturnValue("app/fake/path/locales/en.ts");
      const mockContext = createMockContext(mockOptions, mockGetFilename);

      expect(isTranslationFile(mockContext)).toBe(true);
    });

    it("returns true if the filename matches a directory and extension", () => {
      const mockOptions = [{ directories: ["locales"], extensions: ["ts"] }];
      const mockGetFilename = jest.fn().mockReturnValue("app/fake/path/locales/en.ts");
      const mockContext = createMockContext(mockOptions, mockGetFilename);

      expect(isTranslationFile(mockContext)).toBe(true);
    });

    it("returns false if the filename matches a directory but not an extension", () => {
      const mockOptions = [{ directories: ["locales"], extensions: ["tsx"] }];
      const mockGetFilename = jest.fn().mockReturnValue("app/fake/path/locales/en.ts");
      const mockContext = createMockContext(mockOptions, mockGetFilename);

      expect(isTranslationFile(mockContext)).toBe(false);
    });

    it("returns false if the filename matches an extension but not a directory", () => {
      const mockOptions = [{ directories: ["looocales"], extensions: ["ts"] }];
      const mockGetFilename = jest.fn().mockReturnValue("app/fake/path/locales/en.ts");
      const mockContext = createMockContext(mockOptions, mockGetFilename);

      expect(isTranslationFile(mockContext)).toBe(false);
    });
  });
});
