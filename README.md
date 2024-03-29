# Orphus.js - A Tiny Typo Reporter

Orphus is a tiny zero-configuration typo reporter for web pages.

- 6K minified, 2K gzipped, no dependencies
- invoked by Ctrl+Enter
- reports arriving by e-mail (by default)
- CORS-friendly (no AJAX, using `<iframe>` + `<form>`)
- cross-browser - supports even Internet Explorer 6

You can see it in action [here](https://laravel.ru), [here](https://proger.me) or [here](https://squizzle.me/js/sqimitive). Read about patching for WordPress [here](https://cs-cs.net/sistema-orphus#_orphus_progerxp____202301) (in Russian).

---

![Screenshot](https://raw.githubusercontent.com/ProgerXP/Orphus/master/screenshot.png)


## Installation

### Frontend (JavaScript)

Put the following line anywhere **inside `<body>`** (not inside `<head>`):

```
<script src="https://proger.me/orphus.js"></script>
```

It's best put early in `<body>` so that Ctrl+Enter starts working without waiting for a long page to finish loading. Also, adding `async` or `defer` to that `<script>` improves performance (but `defer` has the same effect as putting `<script>` right before `</body>`).

If you want to configure Orphus, do this anywhere **before** that line. For example, by default reports are sent to `/orphus.php` but you can use the PHP script on my page without touching your backend:

```
<script>
  // Keys for what will become orphus.opt after loading.
  orphus = {
    action: 'https://proger.me/orphus.php',
    strings: {
      subject: 'Typo Reported',
    },
    // If using proger.me/orphus.php, tell me where to forward your reports:
    //email: 'you@example.com',
  }
</script>
```

`orphus.js` hooks `onkeypress` immediately after it was loaded (warning: `document`'s properties `onkeypress` and `onkeydown` must not be used outside of Orphus).

Thereafter you can call its methods via the global `orphus` object which can be also used for configuration:

```
orphus.opt.strings.send = 'Отправить'
orphus.show()
```

Finally, write and include your own styles (you can take `original/orphus-orig.css` as a basis). Note: centering works best with `#orphusp { box-sizing: border-box; }`.

### Self-Hosted (PHP 5.4+)

Follow the instructions above to install the frontend, then copy `orphus.php` to your web root (or change `orphus.opt.action`).

After that either edit the PHP script (not recommended) or create a new script `orphus-local.php` alongside the first and put your specific configuration there. At minimum, you need to set the recipient's e-mail address because for spam reasons `?email` (`orphus.opt.email`) is ignored by default.

```
<?php
// orphus-local.php
$vars['email'] = 'webmaster@proger.me';
```

You can also override the texts, input variables, `mail()` function, etc. - see `orphus.php` for details.


## License Information

Sadly, the license terms are not mentioned anywhere on the original project's page. However, it was abandoned since at least 2015 (see my [forum post](http://www.orphus.ru/community/orphus/common/Ssl.html); [archived version](https://archive.md/6Q5Tl)) so there should be no issue in using it.

I have written the server-side PHP reporting script from scratch and that one is released in public domain ([CC0](https://creativecommons.org/publicdomain/zero/1.0/)). My edits on `orphus.js` are also under CC0.


## Attribution

- http://www.orphus.ru - the original project's homepage
- http://www.koterov.ru - the original author's homepage

### Differences

These are in addition to differences described [here](original/README.md):

- exposed all methods and `opt`ions via `window.orphus`
- made it possible to initialize `opt` by setting `window.orphus` before the script was loaded
- removed default `email`, changed `homepage`, renamed `width` to `maxWidth` (and changed from `550` to `650` pixels)
- added new `opt.strings.submitex` and a `try`/`catch` in `showFor()`
- removed `showMethod` variable (direct call by name), renamed `showMethod()` to `showFor()`
- moved `iframe`, `submitted` and `lastComment` to `self`/`window.orphus`
- moved `email` deobfuscation from `run()` to `self.deobfuscate()`
- removed setting `zIndex` on `#orphusp`
- removed the code for temporary hiding `<select>`s for IE <= 6
- removed hardcoded margins (was min. X/Y 10px)
- added the check for no ranges in `getSelection()` to avoid subsequent exception in `getRangeAt(0)` (can happen if user didn't click inside `<body>` since loading)


## To Do

- add background shader while `#orphusp` is visible
  - click on it works as `Cancel`
- replace using `onkeypress`/`onkeyup` with `addEventListener()`
- migrate CSS classes to [BEM](http://bem.info) (will require changing existing stylesheets)
