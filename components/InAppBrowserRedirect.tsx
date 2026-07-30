"use client";

import { useEffect, useState } from "react";
import { isAndroid, isIOS, isInAppBrowser } from "@/lib/inAppBrowser";

// Guests will mostly open this link from a Zalo/Messenger/Facebook chat,
// which loads it inside that app's own locked-down WebView instead of
// Safari/Chrome — features like downloading the calendar file don't work
// there at all (an app-level restriction, not something this site's code
// can override). Android lets a page hand off to the OS via an
// `intent://` URL, which escapes the WebView into the user's real
// browser — so there we redirect immediately on load. iOS has no
// equivalent (a WKWebView can't be told to open Safari), so there we
// just point the user at the "..." menu these apps already provide for
// exactly this.
export function InAppBrowserRedirect() {
  const [showIOSBanner, setShowIOSBanner] = useState(false);

  useEffect(() => {
    if (!isInAppBrowser()) return;

    if (isAndroid()) {
      const url = window.location.pathname + window.location.search;
      window.location.href = `intent://${window.location.host}${url}#Intent;scheme=https;end`;
      return;
    }

    if (isIOS()) {
      setShowIOSBanner(true);
    }
  }, []);

  if (!showIOSBanner) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-wine px-4 py-3 text-center text-sm text-cream shadow-lg">
      Để xem thiệp mời đầy đủ, vui lòng nhấn <strong>⋯</strong> (hoặc biểu tượng chia sẻ) ở góc màn hình và chọn{" "}
      <strong>&quot;Mở bằng trình duyệt&quot;</strong>.
    </div>
  );
}
