import { create, meta } from "./noUncheckedBrowserApis";
import { ERROR_MESSAGE_IDS } from "./constants";
import { ruleTester, createRule } from "../testUtils";

const rule = createRule({
  name: "noUncheckedBrowserApis",
  defaultOptions: [],
  meta,
  create,
});

ruleTester.run("noUncheckedBrowserApis", rule, {
  valid: [
    'getWindow()?.addEventListener("onclick", () => null);',
    "getWindow()?.location.reload();",
    'getDocument()?.addEventListener("onclick", () => null);',
    'getDocument()?.querySelector("#root");',
  ],
  invalid: [
    {
      code: 'window.addEventListener("onclick", () => null);',
      output: `import { getWindow } from "@shared/utils/getWindow/getWindow";
getWindow()?.addEventListener("onclick", () => null);`,
      errors: [{ messageId: ERROR_MESSAGE_IDS.window }],
    },
    {
      code: "window.location.reload();",
      output: `import { getWindow } from "@shared/utils/getWindow/getWindow";
getWindow()?.location.reload();`,
      errors: [{ messageId: ERROR_MESSAGE_IDS.window }],
    },
    {
      code: 'document.addEventListener("onclick", () => null);',
      output: `import { getDocument } from "@shared/utils/getDocument/getDocument";
getDocument()?.addEventListener("onclick", () => null);`,
      errors: [{ messageId: ERROR_MESSAGE_IDS.document }],
    },
    {
      code: 'document.querySelector("#root");',
      output: `import { getDocument } from "@shared/utils/getDocument/getDocument";
getDocument()?.querySelector("#root");`,
      errors: [{ messageId: ERROR_MESSAGE_IDS.document }],
    },
  ],
});
