"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _sanitizeGqlOperationText = require("./sanitizeGqlOperationText");
describe("sanitizeGqlOperationText", ()=>{
    describe("when the gql operation is valid", ()=>{
        it("responds with the firstLine of the gql operation", ()=>{
            const firstLine = "query fooBar($filter: SomeFilter!) {";
            // The weird indenting here is done on purpose
            const gqlOperation = `
      ${firstLine}
      currentPatient {
        id
        email
        firstName
        lastName
      }
    }
    `;
            const context = {
                getSourceCode: ()=>({
                        getText: ()=>gqlOperation
                    })
            };
            expect((0, _sanitizeGqlOperationText.sanitizeGqlOperationText)(null, context)).toEqual(firstLine);
        });
    });
    describe("when the gql operation is valid and multiline", ()=>{
        it("responds with the firstLine of the gql operation", ()=>{
            const gqlOperation = `
      query ProductViewProductWithVariants_Patient_Query(
        $productId: ID!
        $size: ImageFilterSizeField
        $format: ImageFilterFormatField
      ) {
        viewer {
          product: node(id: $productId) {
            ...ProductWithVariantsFragment
          }
        }
      }
      `;
            const context = {
                getSourceCode: ()=>({
                        getText: ()=>gqlOperation
                    })
            };
            expect((0, _sanitizeGqlOperationText.sanitizeGqlOperationText)(null, context)).toEqual("query ProductViewProductWithVariants_Patient_Query(");
        });
    });
    describe("when the gql operation is invalid", ()=>{
        it("responds with the firstLine of the gql operation", ()=>{
            const firstLine = "invalidOperation fooBar($filter: SomeFilter!) {";
            // The weird indenting here is done on purpose
            const gqlOperation = `
      ${firstLine}
      currentPatient {
        id
        email
        firstName
        lastName
      }
    }
    `;
            const context = {
                getSourceCode: ()=>({
                        getText: ()=>gqlOperation
                    })
            };
            expect((0, _sanitizeGqlOperationText.sanitizeGqlOperationText)(null, context)).toEqual("");
        });
    });
});
