/*! Orphus.js | by Dmitry Koterov & Proger_XP | orphus.ru | proger.me */
;(function () {
  "use strict";

  var opt = {
    version:        '6.0',
    // If prefixed with '!', the value is obfuscated by swapping every second
    // character, e.g. 'foo@bar.com' == '!of@oab.rocm'.
    email:          'hidden',
    homepage:       'http://www.orphus.ru/ru/',
    c_tag1:         '<!!!>',
    c_tag2:         '<!!!>',
    contextLength:  60,
    maxSelection:   256,
    action:         '/orphus.php',  // new
    width:          550,            // new
    strings:        {
      alt:          'Select the fragment with a typo using your mouse and press Ctrl+Enter.',
      badbrowser:   "Your browser doesn't support selection or IFRAME. Perhaps it's too old, or perhaps there's some other error.",
      toobig:       'Your selection is too long. Please select a smaller fragment.',
      subject:      'Orphus Report',
      intextmsg:    'A mistake or typo in this text:',
      ifsendmsg:    'Send a message to the authors? You will stay on this page.',
      gohome:       'Visit the Orphus\' homepage (in a new tab)?',
      name:         'Orphus',
      author:       'Author: Dmitry Koterov.',
      to:           'Proger_XP',
      send:         'Submit',
      cancel:       'Cancel',
      entercmnt:    'Your comment (optional):',
    },
  }

  var showMethod = 'showMethod'
  var _a = 0    //?
  var docEl = document.documentElement
  var body = document.body
  var iframe = null
  var self = {}
  var submitted = false
  var lastComment = ''

  var run = function () {
    if (opt.email.substr(0, 1) == '!') {
      opt.email = opt.email.substr(1).replace(/(.)(.)/g, '$2$1')
    }
    document.onkeypress = onkeypress
  }

  // The _18() function which updated widnow.status was removed because
  // this property no longer works in modern browsers:
  //   https://developer.mozilla.org/en-US/docs/Web/API/Window/status
  //   "However, the HTML standard now requires setting window.status to have
  //    no effect on the text displayed in the status bar."

  var addOffScreen = function (node) {
    node.style.position = 'absolute'
    node.style.top = '-10000px'
    if (body.lastChild) {
      body.insertBefore(node, body.lastChild)
    } else {
      body.appendChild(node)
    }
    return node
  }
  var createIFrame = function (name) {
    var div = document.createElement('DIV')
    div.innerHTML = '<iframe name="' + name + '"></iframe>'
    return addOffScreen(div)
  }

  var submit = function (url, sel, comment) {
    var name = 'orphus_ifr'
    if (!iframe) {
      iframe = createIFrame(name)
    }
    var form = document.createElement('FORM')
    form.action = opt.action
    form.method = 'post'
    form.target = name
    var query = {
      version:  opt.version,
      email:    opt.email,
      to:       opt.strings.to,
      subject:  opt.strings.subject,
      ref:      url,
      c_pre:    sel.pre,
      c_sel:    sel.text,
      c_suf:    sel.suf,
      c_pos:    sel.pos,
      c_tag1:   opt.c_tag1,
      c_tag2:   opt.c_tag2,
      charset:  document.charset || document.characterSet || '',
      comment:  comment,
    }
    for (var name in query) {
      var input = document.createElement('INPUT')
      input.type = 'hidden'
      input.name = name
      input.value = query[name]
      form.appendChild(input)
    }
    addOffScreen(form)
    form.submit()
    form.parentNode.removeChild(form)
  }

  var windowInfo = function () {
    var width = 0
    var height = 0

    if (typeof window.innerWidth == 'number') {
      width = window.innerWidth
      height = window.innerHeight
    } else if (docEl && (docEl.clientWidth || docEl.clientHeight)) {
      width = docEl.clientWidth
      height = docEl.clientHeight
    } else {
      if (body && (body.clientWidth || body.clientHeight)) {
        width = body.clientWidth
        height = body.clientHeight
      }
    }

    var scrollLeft = 0
    var scrollTop = 0

    if (typeof window.pageYOffset == 'number') {
      scrollTop = window.pageYOffset
      scrollLeft = window.pageXOffset
    } else if (body && (body.scrollLeft || body.scrollTop)) {
      scrollTop = body.scrollTop
      scrollLeft = body.scrollLeft
    } else {
      if (docEl && (docEl.scrollLeft || docEl.scrollTop)) {
        scrollTop = docEl.scrollTop
        scrollLeft = docEl.scrollLeft
      }
    }

    return {
      width:        width,
      height:       height,
      scrollLeft:   scrollLeft,
      scrollTop:    scrollTop,
    }
  }

  // The _10.confirm() function was removed because it was not used.
  // It seems it was meant to show the confirmation avoiding overlaying the
  // content with <div>.

  self.showMethod = function (context, submit) {
    if (submitted) {
      return
    }

    submitted = true
    var div = document.createElement('DIV')

    var width = opt.width
    if (width > body.clientWidth - 10) {
      width = body.clientWidth - 10
    }

    div.style.zIndex = 10001

    div.innerHTML =
      '<div id="orphusp" style="width: ' + width + 'px">' +
        '<a class="logo" href="' + opt.homepage + '" target="_blank">Orphus.ru</a>' +
        '<div class="legend">' + opt.strings.intextmsg + '</div>' +
        '<div class="fragment">' +
          context.replace(opt.c_tag1, '<mark>').replace(opt.c_tag2, '</mark>') +
        '</div>' +
        '<div class="hint">' +
          opt.strings.ifsendmsg.replace(/\n/, '<br>') +
        '</div>' +
        '<form>' +
          '<div class="comment">' + opt.strings.entercmnt + '</div>' +
          '<input type="text" maxlength="250">' +
          '<div class="buttons">' +
            '<input type="submit" value="' + opt.strings.send + '">' +
            '&nbsp;' +
            '<input type="button" value="' + opt.strings.cancel + '">' +
          '</div>' +
        '</form>' +
      '</div>'

    addOffScreen(div)
    var inputs = div.getElementsByTagName('input')
    var forms = div.getElementsByTagName('form')
    var commentInput = inputs[0]
    var onkeydown = null
    var hiddenSelects = []

    var end = function () {
      document.onkeydown = onkeydown
      onkeydown = null
      div.parentNode.removeChild(div)
      for (var i = 0; i < hiddenSelects.length; i++) {
        hiddenSelects[i][0].style.visibility = hiddenSelects[i][1]
      }
      submitted = false
      lastComment = commentInput.value
    }

    var pos = function (p) {
      var s = {
        x: 0,
        y: 0,
      }
      while (p.offsetParent) {
        s.x += p.offsetLeft
        s.y += p.offsetTop
        p = p.offsetParent
      }
      return s
    }

    setTimeout(function () {
      var divWidth = div.clientWidth
      var divHeight = div.clientHeight
      var dim = windowInfo()

      var x = (dim.width - divWidth) / 2 + dim.scrollLeft
      if (x < 10) {
        x = 10
      }

      var y = (dim.height - divHeight) / 2 + dim.scrollTop - 10
      if (y < 10) {
        y = 10
      }

      div.style.left = x + 'px'
      div.style.top = y + 'px'

      if (navigator.userAgent.match(/MSIE (\d+)/) && RegExp.$1 < 7) {
        // This seems to be addressing the ancient issue with IE 6- which
        // <select> appeared on top of every other element disregarding z-index.
        var selects = document.getElementsByTagName('SELECT')
        for (var i = 0; i < selects.length; i++) {
          var select = selects[i]
          var p = pos(select)
          if (p.x > x + divWidth || p.y > y + divHeight || p.x + select.offsetWidth < x || p.y + select.offsetHeight < y) {
            continue
          }
          hiddenSelects[hiddenSelects.length] = [select, select.style.visibility]
          select.style.visibility = 'hidden'
        }
      }

      commentInput.value = lastComment
      commentInput.focus()
      commentInput.select()
      onkeydown = document.onkeydown

      document.onkeydown = function (e) {
        if (!e) {
          e = window.event
        }
        if (e.keyCode == 27) {
          end()
        }
      }

      forms[0].onsubmit = function () {
        submit(commentInput.value)
        end()
        lastComment = ''
        return false
      }

      inputs[2].onclick = function () {
        end()
      }
    }, 10)
  }

  var cleanString = function (s) {
    return ('' + s).replace(/[\r\n]+/g, ' ').replace(/^\s+|\s+$/g, '')
  }

  var getSelection = function () {
    var text = null
    var docSel = null
    if (window.getSelection) {
      docSel = window.getSelection()
    } else if (document.getSelection) {
      docSel = document.getSelection()
    } else {
      docSel = document.selection
    }
    var _53 = null  //?
    if (docSel == null) { throw 'null getSelection()' }
    var pre = ''
    var text = null
    var suf = ''
    var pos = -1
    if (docSel.getRangeAt) {
      var range = docSel.getRangeAt(0)
      text = range.toString()
      var newRange = document.createRange()
      newRange.setStartBefore(range.startContainer.ownerDocument.body)
      newRange.setEnd(range.startContainer, range.startOffset)
      pre = newRange.toString()
      var newRange = range.cloneRange()
      newRange.setStart(range.endContainer, range.endOffset)
      newRange.setEndAfter(range.endContainer.ownerDocument.body)
      suf = newRange.toString()
    } else if (docSel.createRange) {
      var range = docSel.createRange()
      text = range.text
      var newRange = docSel.createRange()
      newRange.moveStart('character', -opt.contextLength)
      newRange.moveEnd('character', -text.length)
      pre = newRange.text
      var newRange = docSel.createRange()
      newRange.moveEnd('character', opt.contextLength)
      newRange.moveStart('character', text.length)
      suf = newRange.text
    } else {
      text = '' + docSel
    }
    var p
    var s = (p = text.match(/^(\s*)/)) && p[0].length
    var e = (p = text.match(/(\s*)$/)) && p[0].length
    pre = pre + text.substring(0, s)
    suf = text.substring(text.length - e, text.length) + suf
    text = text.substring(s, text.length - e)
    if (text != '') {
      return {
        pre:  pre,
        text: text,
        suf:  suf,
        pos:  pos,
      }
    }
  }

  var show = function () {
    try {
      var sel = getSelection()
    } catch (e) {
      alert(opt.strings.badbrowser)
      return
    }
    if (!sel) {
      if (confirm(opt.strings.name + " v" + opt.version + ".\n" + opt.strings.author + "\n\n" + opt.strings.alt + "\n\n" + opt.strings.gohome)) {
        window.open(opt.homepage, "_blank")
      }
      return
    }
    sel.pre = sel.pre.substring(sel.pre.length - opt.contextLength, sel.pre.length).replace(/^\S{1,10}\s+/, '')
    sel.suf = sel.suf.substring(0, opt.contextLength).replace(/\s+\S{1,10}$/, '')
    var context = cleanString(sel.pre + opt.c_tag1 + sel.text + opt.c_tag2 + sel.suf)
    if (context.length > opt.maxSelection) {
      alert(opt.strings.toobig)
    } else {
      self[showMethod](context, function (comment) {
        submit(document.location.href, sel, comment)
      })
    }
  }

  var onkeypress = function (e) {
    var handle = false
    var we = window.event
    if (we) {
      handle = we.keyCode == 10 || (we.keyCode == 13 && we.ctrlKey)
    } else if (e) {
      handle = (e.which == 10 && e.modifiers == 2) || (e.keyCode == 0 && e.charCode == 106 && e.ctrlKey) || (e.keyCode == 13 && e.ctrlKey)
    }
    if (handle) {
      show()
      return false
    }
  }

  run()
})();
