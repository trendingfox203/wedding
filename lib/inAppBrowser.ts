// Common in-app browser markers — Zalo, Facebook/Messenger, Instagram,
// Line, WeChat. These embed a restricted WebView that (deliberately, on
// the app's part) can't download files or hand off to Calendar.
const IN_APP_BROWSER_UA = /Zalo|FBAN|FBAV|FB_IAB|Line\/|Instagram|MicroMessenger/i;

export function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  return IN_APP_BROWSER_UA.test(navigator.userAgent);
}

export function isAndroid() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

export function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iP(hone|od|ad)/i.test(navigator.userAgent);
}
