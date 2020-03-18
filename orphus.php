<?php
/***
  Orphus.js | Typo Reporting Backend
  Originally by Dmitry Koterov | orphus.ru
  Adaptation by Proger_XP | proger.me
  PHP 5.4+ | Public domain (CC0)
 ***

  If your system has no sendmail by default, install dma - a lightweight MDA.

  If sending from domain(s) different from where this script is located, do not
  add X-Frame-Options and other headers that would block the cross-origin <form>.

  If ./orphus.log exists and is writable then reports are appended there
  in addition to using $mail().

  POST:
  - c_pos     = -1
  - c_pre     = text              - required
  - c_sel     = text              - required
  - c_suf     = text              - required
  - c_tag1    = <!!!>
  - c_tag2    = <!!!>
  - charset   = UTF-8             - required
  - comment   = user-supplied
  - email     = web@master        - required but ignored by default
  - ref       = https://url       - required
  - subject   = Mail subject
  - to        = Webmaster
  - version   = 5.01              - 6.0 for this adaptation
*/

function errorFinish($e = null) {
  global $strings;
  headers_sent() or http_response_code(400);
  echo '--><script>alert(', json_encode($strings['error']), ')</script><!--';
  // Reflect the exception in server logs.
  if (is_object($e)) { throw $e; }
  exit;
}

set_exception_handler('errorFinish');

header('Content-Type: text/html; charset=utf-8');
echo '<!-- ';   // hide emitted PHP errors if display_errors is on.

$strings = [
  'error' => 'Unable to send the report.',
  'success' => 'Thank you for the report.',
  'template' => function (array $vars) {
    return <<<TEXT
Typo Report by Orphus

Page URL: $vars[ref]
Visitor's comment: $vars[comment]
Context:
  $vars[context]
Browser: $_SERVER[HTTP_USER_AGENT]

Sent bypassing the web-interface http://orphus.ru.

This message was automatically generated. Please do not respond to it.
TEXT;
  },
];

$vars = $_REQUEST;
// Force the email to prevent spammers from using us as a relay host.
// Must be specified in orphus-local.php.
unset($vars['email']);

// Optional ones.
$vars += ['c_pos' => -1, 'c_tag1' => '<!!!>', 'c_tag2' => '<!!!>',
          'comment' => '', 'subject' => 'Orphus', 'to' => '', 'version' => ''];

$_SERVER += ['HTTP_USER_AGENT' => ''];

// The reporting function. Falsy result is considered a failure.
$mail = 'mail';

// Your specific configuration, for example:
//header('Access-Control-Allow-Origin: *');
//$vars['email'] = 'webmaster@proger.me';
//$mail = function (...) { push_to_queue(); };
is_file($config = __DIR__.'/orphus-local.php') and require($config);

if (isset($vars['c_pre']) and isset($vars['c_sel']) and isset($vars['c_suf'])
    and $vars['charset'] and $vars['email'] and $vars['ref']) {
  $vars['context'] = "$vars[c_pre]$vars[c_tag1]$vars[c_sel]$vars[c_tag2]$vars[c_suf]";

  if (strtolower($vars['charset']) !== 'utf-8') {
    foreach ($vars as &$v) {
      $v = iconv($vars['charset'], 'utf-8//TRANSLIT', $v);
    }
  }

  $eol = "\r\n";
  // wordwrap() is not Unicode-safe but we don't have a better one.
  $vars['context'] = wordwrap(preg_replace('/^\s+|\s+$|(\s){2,}/u', '\1', $vars['context']), 75, "$eol  ");

  $text = call_user_func($strings['template'], $vars);
  $text = preg_replace('/\r?\n/u', $eol, $text);  // normalize to CRLF.

  // Returns false for non-existing files.
  if (is_writable($log = 'orphus.log')) {
    $logText = "$text$eol$eol".
               date('d.m.Y H:i:s')."$eol$eol".
               str_repeat('-', 75)."$eol$eol";
    file_put_contents($log, $logText, FILE_APPEND | LOCK_EX);
  }

  $headers = "Content-Type: text/plain; charset=utf-8$eol".
             "Content-Transfer-Encoding: 8bit";

  $to = "$vars[to]<$vars[email]>";
  if (call_user_func($mail, $to, $vars['subject'], $text, $headers)) {
    echo '--><script>alert(', json_encode($strings['success']), ')</script>';
    exit;
  }
}

errorFinish();
