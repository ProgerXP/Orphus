(function() {
  var version = "5.01";
  var email = "!rohpsud@lkbar.u";
  var homepage = "//www.orphus.ru/en/";
  var c_tag1 = "<!!!>";
  var c_tag2 = "<!!!>";
  var contextLength = 60;
  var maxSelection = 256;
  var strings = {
    // English (English)
    alt: "Select spelling error with mouse and press Ctrl+Enter. Let's make the language clean!",
    badbrowser: "Your browser does not support selection handling or IFRAMEs. Probably, you use an obsolete browser.",
    toobig: "You have selected too large text block!",
    thanks: "Thank you for your co-operation!",
    subject: "Spelling error",
    docmsg: "Document:",
    intextmsg: "Spelling error in text:",
    ifsendmsg: "Do you want to send a notice to a webmaster?\nYour browser will NOT be redirected.",
    gohome: "Do you want to visit Orphus homepage now?",
    newwin: "Page will be opened in a new window.",
    name: "Orphus system",
    author: "Author: Dmitry Koterov.",
    to: "Orphus user",
    // 5.0
    send: "Send",
    cancel: "Cancel",
    entercmnt: "A comment for a webmaster (optional):"// Dmitry Koterov

  };
  var showMethod = "css";
  var _a = 0;
  var w = window;
  var d = w.document;
  var docEl = d.documentElement;
  var body = d.body;
  var iframe = null;
  var self = {};
  var submitted = false;
  var lastComment = "";
  var run = function() {
    if (email.substr(0, 1) == "!") {
      email = email.substr(1).replace(/(.)(.)/g, "$2$1");
    }
    setTimeout(function() {
      var _14 = _15();
      if (_14) {
        _14.onclick = _16;
        _14.title = _14.childNodes[0] && _14.childNodes[0].alt;
      }
    }, 100);
    d.onkeypress = onkeypress;
    strings.gohome += " " + strings.newwin;
  };
  var _15 = function() {
    return d.getElementById("orphus");
  };
  var _16 = function() {
    with (strings) {
      if (confirm(name + " v" + version + ".\n" + author + "\n\n" + alt + "\n\n" + gohome)) {
        w.open(homepage, "_blank");
      }
      return false;
    }
  };
  var _18 = function() {
    var n = 0;
    var _1a = function() {
      if (++n > 20) {
        return;
      }
      w.status = (n % 5) ? strings.thanks : " ";
      setTimeout(_1a, 100);
    };
    _1a();
  };
  var addOffScreen = function(node) {
    node.style.position = "absolute";
    node.style.top = "-10000px";
    if (body.lastChild) {
      body.insertBefore(node, body.lastChild);
    } else {
      body.appendChild(node);
    }
  };
  var createIFrame = function(name) {
    var div = d.createElement("DIV");
    div.innerHTML = "<iframe name=\"" + name + "\"></iframe>";
    addOffScreen(div);
    return d.childNodes[0];
  };
  var submit = function(url, sel, comment) {
    var name = "orphus_ifr";
    if (!iframe) {
      iframe = createIFrame(name);
    }
    var form = d.createElement("FORM");
    form.style.position = "absolute";
    form.style.top = "-10000px";
    form.action = homepage;
    form.method = "post";
    form.target = name;
    var query = {
      version: version,
      email: email,
      to: strings.to,
      subject: strings.subject,
      ref: url,
      c_pre: sel.pre,
      c_sel: sel.text,
      c_suf: sel.suf,
      c_pos: sel.pos,
      c_tag1: c_tag1,
      c_tag2: c_tag2,
      charset: d.charset || d.characterSet || "",
      comment: comment
    };
    for (var name in query) {
      var input = d.createElement("INPUT");
      input.type = "hidden";
      input.name = name;
      input.value = query[name];
      form.appendChild(input);
    }
    addOffScreen(form);
    form.submit();
    form.parentNode.removeChild(form);
  };
  var windowInfo = function() {
    var width = 0
    var height = 0;
    if (typeof (w.innerWidth) == "number") {
      width = w.innerWidth;
      height = w.innerHeight;
    } else {
      if (docEl && (docEl.clientWidth || docEl.clientHeight)) {
        width = docEl.clientWidth;
        height = docEl.clientHeight;
      } else {
        if (body && (body.clientWidth || body.clientHeight)) {
          width = body.clientWidth;
          height = body.clientHeight;
        }
      }
    }
    var scrollLeft = 0
    var scrollRight = 0;
    if (typeof (w.pageYOffset) == "number") {
      scrollRight = w.pageYOffset;
      scrollLeft = w.pageXOffset;
    } else {
      if (body && (body.scrollLeft || body.scrollTop)) {
        scrollRight = body.scrollTop;
        scrollLeft = body.scrollLeft;
      } else {
        if (docEl && (docEl.scrollLeft || docEl.scrollTop)) {
          scrollRight = docEl.scrollTop;
          scrollLeft = docEl.scrollLeft;
        }
      }
    }
    return {
      w: width,
      h: height,
      x: scrollLeft,
      y: scrollRight
    };
  };
  self.confirm = function(_2e, _2f, _30) {
    var ts = new Date().getTime();
    var _32 = confirm(strings.docmsg + "\n   " + d.location.href + "\n" + strings.intextmsg + "\n   \"" + _2e + "\"\n\n" + strings.ifsendmsg);
    var dt = new Date().getTime() - ts;
    if (_32) {
      _2f("");
    } else {
      if (!_30 && dt < 50) {
        var sv = d.onkeyup;
        d.onkeyup = function(e) {
          if (!e) {
            e = window.event;
          }
          if (e.keyCode == 17) {
            d.onkeyup = sv;
            self.confirm(_2e, _2f, true);
          }
        }
        ;
      }
    }
  }
  ;
  self.css = function(context, submit) {
    if (submitted) {
      return;
    }
    submitted = true;
    var div = d.createElement("DIV");
    var w = 550;
    if (w > body.clientWidth - 10) {
      w = body.clientWidth - 10;
    }
    div.style.zIndex = "10001";
    div.innerHTML =
      "" +
      "<div style=\"background:#D4D0C8; width:" + w + "px; z-index:10001; border: 1px solid #555; padding:1em; font-family: Arial; font-size: 90%; color:black\">" +
      "<a href=\"" + homepage + "\" target=\"_blank\">" +
      "<img style=\"float:right; margin:0 0 1em 1em\" border=\"0\" src=\"" + _15().childNodes[0].src + "\"/>" +
      "</a>" +
      "<div style=\"font-weight:bold; padding-bottom:0.2em\">" +
      strings.intextmsg +
      "</div>" +
      "<div style=\"padding: 0 0 1em 1em\">" +
      context.replace(c_tag1, "<u style=\"color:red\">").replace(c_tag2, "</u>") +
      "</div>" +
      "<div style=\"padding: 0 0 1em 0\">" +
      strings.ifsendmsg.replace(/\n/, "<br/>") +
      "</div>" +
      "<form style=\"padding:0; margin:0; border:0\">" +
      "<div>" + strings.entercmnt + "</div>" +
      "<input type=\"text\" maxlength=\"250\" style=\"width:100%; margin: 0.2em 0\" />" +
      "<div style=\"text-align:right; font-family: Tahoma\">" +
      "<input type=\"submit\" value=\"" + strings.send + "\" style=\"width:9em; font-weight: bold\">&nbsp;" +
      "<input type=\"button\" value=\"" + strings.cancel + "\" style=\"width:9em\">" +
      "</div>" +
      "</form>" +
      "</div>" +
      "";
    addOffScreen(div);
    var inputs = div.getElementsByTagName("input");
    var forms = div.getElementsByTagName("form");
    var commentInput = inputs[0];
    var onkeydown = null;
    var hiddenSelects = [];
    var end = function() {
      d.onkeydown = onkeydown;
      onkeydown = null;
      div.parentNode.removeChild(div);
      for (var i = 0; i < hiddenSelects.length; i++) {
        hiddenSelects[i][0].style.visibility = hiddenSelects[i][1];
      }
      submitted = false;
      lastComment = commentInput.value;
    };
    var pos = function(p) {
      var s = {
        x: 0,
        y: 0
      };
      while (p.offsetParent) {
        s.x += p.offsetLeft;
        s.y += p.offsetTop;
        p = p.offsetParent;
      }
      return s;
    };
    setTimeout(function() {
      var w = div.clientWidth;
      var h = div.clientHeight;
      var dim = windowInfo();
      var x = (dim.w - w) / 2 + dim.x;
      if (x < 10) {
        x = 10;
      }
      var y = (dim.h - h) / 2 + dim.y - 10;
      if (y < 10) {
        y = 10;
      }
      div.style.left = x + "px";
      div.style.top = y + "px";
      if (navigator.userAgent.match(/MSIE (\d+)/) && RegExp.$1 < 7) {
        var select = d.getElementsByTagName("SELECT");
        for (var i = 0; i < select.length; i++) {
          var s = select[i];
          var p = pos(s);
          if (p.x > x + w || p.y > y + h || p.x + s.offsetWidth < x || p.y + s.offsetHeight < y) {
            continue;
          }
          hiddenSelects[hiddenSelects.length] = [s, s.style.visibility];
          s.style.visibility = "hidden";
        }
      }
      commentInput.value = lastComment;
      commentInput.focus();
      commentInput.select();
      onkeydown = d.onkeydown;
      d.onkeydown = function(e) {
        if (!e) {
          e = window.event;
        }
        if (e.keyCode == 27) {
          end();
        }
      }
      ;
      forms[0].onsubmit = function() {
        submit(commentInput.value);
        end();
        lastComment = "";
        return false;
      }
      ;
      inputs[2].onclick = function() {
        end();
      }
      ;
    }, 10);
  }
  ;
  var cleanString = function(s) {
    return ("" + s).replace(/[\r\n]+/g, " ").replace(/^\s+|\s+$/g, "");
  };
  var getSelection = function() {
    try {
      var text = null;
      var docSel = null;
      if (w.getSelection) {
        docSel = w.getSelection();
      } else {
        if (d.getSelection) {
          docSel = d.getSelection();
        } else {
          docSel = d.selection;
        }
      }
      var _53 = null;
      if (docSel != null) {
        var pre = ""
        var text = null
        var suf = ""
        var pos = -1;
        if (docSel.getRangeAt) {
          var range = docSel.getRangeAt(0);
          text = range.toString();
          var newRange = d.createRange();
          newRange.setStartBefore(range.startContainer.ownerDocument.body);
          newRange.setEnd(range.startContainer, range.startOffset);
          pre = newRange.toString();
          var newRange = range.cloneRange();
          newRange.setStart(range.endContainer, range.endOffset);
          newRange.setEndAfter(range.endContainer.ownerDocument.body);
          suf = newRange.toString();
        } else {
          if (docSel.createRange) {
            var range = docSel.createRange();
            text = range.text;
            var newRange = docSel.createRange();
            newRange.moveStart("character", -contextLength);
            newRange.moveEnd("character", -text.length);
            pre = newRange.text;
            var newRange = docSel.createRange();
            newRange.moveEnd("character", contextLength);
            newRange.moveStart("character", text.length);
            suf = newRange.text;
          } else {
            text = "" + docSel;
          }
        }
        var p;
        var s = (p = text.match(/^(\s*)/)) && p[0].length;
        var e = (p = text.match(/(\s*)$/)) && p[0].length;
        pre = pre + text.substring(0, s);
        suf = text.substring(text.length - e, text.length) + suf;
        text = text.substring(s, text.length - e);
        if (text == "") {
          return null;
        }
        return {
          pre: pre,
          text: text,
          suf: suf,
          pos: pos
        };
      } else {
        alert(strings.badbrowser);
        return;
      }
    } catch (e) {
      return null;
    }
  };
  var show = function() {
    if (!email || navigator.appName.indexOf("Netscape") != -1 && eval(navigator.appVersion.substring(0, 1)) < 5) {
      alert(strings.badbrowser);
      return;
    }
    var _5e = function(_5f) {
      alert("Wrong installation (code " + _5f + "). Please reinstall Orphus.");
    };
    var _60 = _15();
    if (!_60) {
      _5e(1);
      return;
    }
    if (_60.href.replace(/.*\/\/|\/.*/g, "") != homepage.replace(/.*\/\/|\/.*/g, "")) {
      _5e(2);
      return;
    }
    var i = null;
    for (var n = 0; n < _60.childNodes.length; n++) {
      if (_60.childNodes[n].tagName == "IMG") {
        i = _60.childNodes[n];
        break;
      }
    }
    if (!i) {
      _5e(3);
      return;
    }
    if (!i.alt.match(/orphus/i)) {
      _5e(4);
      return;
    }
    if (i.width < 30 && i.height < 10) {
      _5e(5);
      return;
    }
    if (_60.style.display == "none" || i.style.display == "none" || _60.style.visibility == "hidden" || i.style.visibility == "hidden") {
      _5e(6);
      return;
    }
    var sel = getSelection();
    if (!sel) {
      return;
    }
    with (sel) {
      pre = pre.substring(pre.length - contextLength, pre.length).replace(/^\S{1,10}\s+/, "");
      suf = suf.substring(0, contextLength).replace(/\s+\S{1,10}$/, "");
    }
    var context = cleanString(sel.pre + c_tag1 + sel.text + c_tag2 + sel.suf);
    if (context.length > maxSelection) {
      alert(strings.toobig);
      return;
    }
    self[showMethod](context, function(comment) {
      submit(d.location.href, sel, comment);
      _18();
    });
  };
  var onkeypress = function(e) {
    var handle = 0;
    var we = w.event;
    if (we) {
      handle = we.keyCode == 10 || (we.keyCode == 13 && we.ctrlKey);
    } else {
      if (e) {
        handle = (e.which == 10 && e.modifiers == 2) || (e.keyCode == 0 && e.charCode == 106 && e.ctrlKey) || (e.keyCode == 13 && e.ctrlKey);
      }
    }
    if (handle) {
      show();
      return false;
    }
  };
  run();
}
)();
