const DISALLOWED_BROWSER_INTERFACES = ["window", "document"];
const BROWSER_INTERFACE_ABSTRACTIONS = {
  window: "getWindow",
  document: "getDocument",
};

const ERROR_MESSAGE_IDS = {
  document: "noUncheckedDocument",
  window: "noUncheckedWindow",
};

export { DISALLOWED_BROWSER_INTERFACES, BROWSER_INTERFACE_ABSTRACTIONS, ERROR_MESSAGE_IDS };
