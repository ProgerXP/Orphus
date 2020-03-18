These are the original files and their light adaptations:

- `orphus-orig-min.js` - the latest author's version as obtained from [this page](http://www.orphus.ru/en/orphus.js?nodownload&email=!rohpsud@lkbar.u), verbatim
- `orphus-orig.js` - ...pretty-printed version using Chrome, no other changes
- `orphus-orig-renamed.js` - ...with obfuscated identifiers renamed to match `orphus.js`
- `orphus-orig.css` - original styles extracted from `self.css()`
- `orphus.js` - my adaptation (see below for differences)

## Differences

- added `/*!...*/` on top
- version changed from `5.01` to `6.0`
- all option variables wrapped into `opt` (object)
- added options: `action` (for `<form>`), `width` (for `<div id="orphusp">`)
- rewritten English `strings`, removed `thanks`, `docmsg`, `newwin` (appended directly to `gohome`, removed from `run()`)
- renamed `css()` to `showMethod()`
- removed unused variables: `_a`, `_53`
- removed dependency on the logo image: `setTimeout()` in `run()`, `_15()`, `_16()` (moved to `show()`), `<img>` in `#orphusp`, checks in `show()`
- removed `_18()` used to update `window.status` ([no longer works](https://developer.mozilla.org/en-US/docs/Web/API/Window/status))
- removed unused `_10.confirm()` (probably was meant for calling by changing `showMethod` from `"css"` to `"confirm"`)
- removed hardcoded CSS styles (`style="..."`, except for `width`, `left`, `top`), instead added a single `id="orphusp"` to the main `<div>`
- added CSS classes: `logo`, `legend`, `fragment`, `hint`
- replaced `<u>` with a more semantic `<mark>`
- made tags HTML5 rather than XHTML
- moved wrapping `try`/`catch` from `getSelection()` to its call in `show()`
- removed checks for `!email` and `Netscape < 5`
- removed `with { ... }`
- added `"use strict";`
- minor stylistic changes
