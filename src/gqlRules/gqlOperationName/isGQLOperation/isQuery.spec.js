import { isQuery } from "./isQuery";

describe("isQuery", () => {
  describe("when operationText starts with 'query'", () => {
    it("returns true", () => {
      expect(isQuery("query something {")).toBeTruthy();
    });
  });

  describe("when operationText starts with 'mutation'", () => {
    it("returns false", () => {
      expect(isQuery("mutation something {")).toBeFalsy();
    });
  });
});
