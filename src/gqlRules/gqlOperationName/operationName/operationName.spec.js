import { operationName } from "./operationName";

describe("operationName", () => {
  describe("when gql operation is a query", () => {
    it("returns the query name", () => {
      const queryName = "fooBarQuery";

      expect(operationName(`query ${queryName} {`, "Query")).toEqual(queryName);
    });

    describe("the query is multiline", () => {
      it("returns the query name", () => {
        const queryName = "ProductViewProductWithVariants_Patient_Query";

        expect(operationName(`query ${queryName}(`, "Query")).toEqual(queryName);
      });
    });
  });

  describe("when gql operation is a mutation", () => {
    it("returns the mutation name", () => {
      const mutationName = "mutationName";

      expect(
        operationName(
          `mutation ${mutationName}($input: AuthPatientSignUpFromRxInput!) {`,
          "Mutation"
        )
      ).toEqual(mutationName);
    });
  });
});
