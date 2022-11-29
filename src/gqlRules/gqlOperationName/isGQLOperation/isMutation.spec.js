import { isMutation } from "./isMutation";

describe("isMutation", () => {
  describe("when operationText starts with 'query'", () => {
    it("returns false", () => {
      expect(isMutation("query something {")).toBeFalsy();
    });
  });

  describe("when operationText starts with 'mutation'", () => {
    it("returns true", () => {
      expect(isMutation("mutation something {")).toBeTruthy();
    });
  });
});
