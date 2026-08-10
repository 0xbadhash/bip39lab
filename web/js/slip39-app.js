/**
 * SLIP-39 lab shell chrome only (ship A).
 * No split/combine crypto — ships B/C own demos.
 * Teach toggle + step-rail live in help-ui.js.
 */
(function () {
  "use strict";
  // Mark surface for e2e / future wiring without loading a crypto bundle.
  document.documentElement.setAttribute("data-slip39-shell", "a");
})();
